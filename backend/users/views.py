from django.db import transaction,IntegrityError

from rest_framework.generics import CreateAPIView,ListAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError,AuthenticationFailed
from django.conf import settings
from django.db.models import Q


from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import (CustomTokenRefreshSerializer,
                          ChangePasswordSerializer,
                          ChangeEmailSerializer,
                          VerifyChangeEmailSerializer,
                          GoogleAuthenticationSerializer,
                          ProfileCompletionSerializer
                          )


from common.services.cloudinary_service import upload_image, delete_image
from .serializers import AvatarUploadSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import logging

from .serializers import(
    UserSerializer,
    VerifyOTPSerializer, 
    ResendOTPSerializer,
    LoginSerializer,
    UserProfileSerializer,
    AdminUserListSerializer,
    UpdateProfileSerializer,
    )
from .models import User,EmailOtp
from .services.otp_service import create_otp_record, verify_otp, resend_otp
from .services.email_service import send_otp_email, send_reset_password_mail
from .services.password_reset_service import generate_password_reset_link

from .serializers import ForgotPasswordSerializer,ResetPasswordSerializer

from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from .permissions import IsAdminRole
from .pagination import UserListPagination

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from users.models import Address
from users.serializers import AddressSerializer


logger = logging.getLogger(__name__)


@method_decorator(csrf_protect, name="dispatch")
class RegisterUserView(CreateAPIView):

    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        raw_otp, otp_record = create_otp_record(
            user,
        )

        send_otp_email(
            user,
            raw_otp,
        )

        return Response(
            {
                "message": "Registration successful. Please verify your email.",
                "email": user.email
            },
            status=status.HTTP_201_CREATED
        )

@method_decorator(csrf_protect, name="dispatch")
class VerifyEmailView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    @transaction.atomic
    def post(self, request):

        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        submitted_otp = serializer.validated_data["otp"]

        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {"message": "Invalid email or OTP."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_email_verified:
            return Response(
                {"message": "Email is already verified."},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_valid, message = verify_otp(
            user,
            submitted_otp,
        )

        if not is_valid:
            return Response(
                {"message": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        return Response(
            {"message": "Email verified successfully."},
            status=status.HTTP_200_OK
        )

@method_decorator(csrf_protect, name="dispatch")
class ResendOTPView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    @transaction.atomic
    def post(self, request):

        serializer = ResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].lower()

        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {"message": "User with this email does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.is_email_verified:
            return Response(
                {"message": "Email is already verified."},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_sent, raw_otp, message,remaining_seconds = resend_otp(
            user,
        )

        if not is_sent:
            return Response(
                {"message": message,
                 "remaining_seconds":remaining_seconds,
                 },
                status=status.HTTP_400_BAD_REQUEST
            )

        send_otp_email(
            user,
            raw_otp,
        )

        return Response(
            {"message": message,
             "remaining_seconds":remaining_seconds,
             },
            status=status.HTTP_200_OK
        )



@method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.check_password(password):
            return Response(
                {"message": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {
                    "message": "Your account has been deactivated. Please contact support."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if not user.is_email_verified:
            return Response(
                {
                    "message": "Please verify your email before logging in.",
                    "is_email_verified": False,
                    "email": user.email
                },
                status=status.HTTP_403_FORBIDDEN
            )


        refresh = RefreshToken.for_user(user)

        refresh["role"] = user.role
        refresh["email"] = user.email
        refresh["first_name"] = user.first_name
        refresh["last_name"] = user.last_name
        refresh["password_reset_version"] = user.password_reset_version

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        user_data = UserProfileSerializer(user).data

        response = Response(
            {
                "message": "Login successful.",
                "user": user_data
            },
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()),
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/"
        )

        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/",
        )

        return response


@ensure_csrf_cookie
@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([])
def csrf_token_view(request):

    csrf_token = get_token(request)

    return Response({
        "csrfToken": csrf_token
    })




@method_decorator(csrf_protect, name="dispatch")
class CustomTokenRefreshView(TokenRefreshView):

    serializer_class = CustomTokenRefreshSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, *args, **kwargs):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            return Response(
                {"message": "Refresh token is missing. Please log in again."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        serializer = self.get_serializer(
            data={"refresh": refresh_token}
        )

        serializer.is_valid(raise_exception=True)

        access_token = serializer.validated_data["access"]

        response = Response(
            {"message": "Token refreshed successfully."},
            status=status.HTTP_200_OK
        )

        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=int(
                settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
            ),
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
            path="/",
        )

        return response




class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"].strip().lower()

        user = User.objects.filter(email=email).first()

        if not user or not user.is_active:
            return Response(
                {
                    "message": "If an eligible account exists, a password reset Link has been sent."
                },
                status=status.HTTP_200_OK
            )

        reset_link = generate_password_reset_link(user)

        send_reset_password_mail(user, reset_link)
        

        return Response(
            {
                "message": "If an eligible account exists, a password reset Link has been sent."
            },
            status=status.HTTP_200_OK
        )



class ResetPasswordView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        reset_version = serializer.validated_data["reset_version"]

        with transaction.atomic():
            locked_user =User.objects.filter(id=user.id,is_active=True).first()

            if (
                not locked_user or locked_user.password_reset_version != reset_version
            ):
                raise ValidationError({
                    "token":"Invalid or already used password reset Link."
                })

            locked_user.set_password(serializer.validated_data["new_password"])

            locked_user.password_reset_version+=1

            locked_user.save(update_fields=["password","password_reset_version"])

        return Response(
            {
                "message": "Password reset successfully."
            },
            status=status.HTTP_200_OK
        )


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                refresh.blacklist()

            except TokenError:
                pass

        response = Response(
            {"message": "Logout successful."},
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            "access_token",
            path="/",
            samesite="Lax"
        )

        response.delete_cookie(
            "refresh_token",
            path="/",
            samesite="Lax"
        )

        return response


class UserProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def patch(self, request):

        serializer = UpdateProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            UserProfileSerializer(request.user).data,
            status=status.HTTP_200_OK
        )




class UserAvatarView(APIView):

    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request):

        serializer = AvatarUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        image = serializer.validated_data["avatar"]

        user = request.user
        old_public_id = user.avatar_public_id
        uploaded_image = None

        try:
            # 1. Upload new image to Cloudinary
            uploaded_image = upload_image(
                image,
                folder="vectis/avatars",
                transformation=[
                    {
                        "width": 500,
                        "height": 500,
                        "crop": "fill",
                        "gravity": "face",
                    }
                ]
            )

            # 2. Update database with new public ID
            user.avatar_public_id = uploaded_image["public_id"]
            user.save(update_fields=["avatar_public_id"])

        except Exception:
            # Clean up newly uploaded image if database update fails
            if uploaded_image:
                try:
                    delete_image(uploaded_image["public_id"])
                except Exception:
                    logger.exception(
                        "Failed to clean up newly uploaded avatar."
                    )

            logger.exception("Avatar upload failed.")

            return Response(
                {
                    "message": "Unable to upload profile picture. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 3. Delete previous image after successful database update
        if old_public_id:
            try:
                result = delete_image(old_public_id)

                if result and result.get("result") not in ["ok", "not found"]:
                    logger.warning(
                        "Old avatar deletion was not confirmed: %s",
                        old_public_id
                    )

            except Exception:
                logger.exception(
                    "New avatar saved, but old avatar deletion failed."
                )

        return Response(
            {
                "message": "Profile picture updated successfully.",
                "avatar_url": uploaded_image["secure_url"],
            },
            status=status.HTTP_200_OK
        )

    
    def delete(self, request):

        user = request.user
        old_public_id = user.avatar_public_id

        if not old_public_id:
            return Response(
                {"message": "No profile picture to remove."},
                status=status.HTTP_200_OK
            )

        try:
            # 1. Clear the avatar reference in PostgreSQL
            user.avatar_public_id = None
            user.save(update_fields=["avatar_public_id"])

        except Exception:
            logger.exception(
                "Failed to clear avatar reference from database."
            )

            return Response(
                {
                    "message": "Unable to remove profile picture. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 2. Delete the old image from Cloudinary
        try:
            result = delete_image(old_public_id)

            if result and result.get("result") not in ["ok", "not found"]:
                logger.warning(
                    "Avatar deletion from Cloudinary was not confirmed: %s",
                    old_public_id
                )

        except Exception:
            logger.exception(
                "Avatar reference cleared, but Cloudinary deletion failed: %s",
                old_public_id
            )

        return Response(
            {
                "message": "Profile picture removed successfully."
            },
            status=status.HTTP_200_OK
        )



class AdminUserListView(ListAPIView):

    serializer_class = AdminUserListSerializer
    permission_classes = [IsAdminRole]
    pagination_class = UserListPagination

    def get_queryset(self):

        queryset = User.objects.filter(
            role=User.Role.USER
        ).order_by("-created_at")

        # Search customers
        search = self.request.query_params.get("search", "").strip()

        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search)
            )

        # Filter by account status
        status_filter = self.request.query_params.get(
            "status", "ALL"
        ).upper()

        if status_filter == "ACTIVE":
            queryset = queryset.filter(is_active=True)

        elif status_filter == "BLOCKED":
            queryset = queryset.filter(is_active=False)

        elif status_filter != "ALL":
            raise ValidationError({
                "status": "Invalid status. Use ALL, ACTIVE or BLOCKED."
            })

        return queryset



class AdminUserStatusView(APIView):

    permission_classes = [IsAdminRole]

    def patch(self, request, user_id, action):

        user = User.objects.filter(
            id=user_id,
            role=User.Role.USER
        ).first()

        if not user:
            return Response(
                {"message": "Customer not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.id == request.user.id:
            return Response(
                {"message": "You cannot change your own account status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if action == "block":

            if not user.is_active:
                return Response(
                    {"message": "Customer is already blocked."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.is_active = False
            message = "Customer blocked successfully."

        elif action == "unblock":

            if user.is_active:
                return Response(
                    {"message": "Customer is already active."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.is_active = True
            message = "Customer unblocked successfully."

        else:
            return Response(
                {"message": "Invalid action."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.save(update_fields=["is_active"])

        return Response(
            {
                "message": message,
                "user_id": str(user.id),
                "is_active": user.is_active
            },
            status=status.HTTP_200_OK
        )


class AddressListCreateView(generics.ListCreateAPIView):

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        # Lock the user row to prevent simultaneous address
        # creation requests from assigning multiple defaults.
        user = (
            self.request.user.__class__.objects
            .select_for_update()
            .get(pk=self.request.user.pk)
        )

        has_addresses = Address.objects.filter(user=user).exists()

        serializer.save(
            user=user,
            is_default=not has_addresses
        )


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_destroy(self, instance):

        was_default = instance.is_default
        user = instance.user

        instance.delete()

        if was_default:
            next_address = (
                Address.objects
                .filter(user=user)
                .order_by("-updated_at", "-created_at")
                .first()
            )

            if next_address:
                next_address.is_default = True
                next_address.save(update_fields=["is_default", "updated_at"])


class SetDefaultAddressView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def patch(self, request, id):

        # Lock the user row so concurrent default changes
        # for the same user are serialized.
        user = (
            request.user.__class__.objects
            .select_for_update()
            .get(pk=request.user.pk)
        )

        address = get_object_or_404(
            Address.objects.select_for_update(),
            id=id,
            user=user
        )

        # Remove the existing default address.
        Address.objects.filter(
            user=user,
            is_default=True
        ).update(is_default=False)

        # Set the selected address as default.
        address.is_default = True
        address.save(update_fields=["is_default", "updated_at"])

        serializer = AddressSerializer(address)

        return Response(
            {
                "message": "Default address updated successfully.",
                "address": serializer.data
            },
            status=status.HTTP_200_OK
        )



class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        with transaction.atomic():

            # Lock the user record
            user = (
                User.objects
                .select_for_update()
                .get(pk=request.user.pk)
            )

            # Recheck current password after acquiring the lock
            if not user.check_password(
                serializer.validated_data["current_password"]
            ):
                return Response(
                    {
                        "current_password":
                        "Current password is incorrect."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update password
            user.set_password(
                serializer.validated_data["new_password"]
            )

            # Invalidate existing access and refresh tokens
            user.password_reset_version += 1

            user.save(
                update_fields=[
                    "password",
                    "password_reset_version"
                ]
            )

        # Clear current browser authentication cookies
        response = Response(
            {
                "message": "Password changed successfully. Please log in again."
            },
            status=status.HTTP_200_OK
        )

        response.delete_cookie(
            "access_token",
            path="/",
            samesite="Lax"
        )

        response.delete_cookie(
            "refresh_token",
            path="/",
            samesite="Lax"
        )

        return response



class ChangeEmailView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangeEmailSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        new_email = serializer.validated_data["new_email"]

        try:
            with transaction.atomic():

                user = User.objects.select_for_update().get(
                    pk=request.user.pk
                )

                # Check again before creating the OTP.
                if User.objects.filter(email__iexact=new_email).exists():
                    return Response(
                        {"new_email": "This email address is already registered."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                raw_otp, otp_record = create_otp_record(
                    user=user,
                    purpose=EmailOtp.Purpose.CHANGE_EMAIL,
                    target_email=new_email
                )

                send_otp_email(
                    user=user,
                    raw_otp=raw_otp,
                    purpose=otp_record.purpose,
                    target_email=otp_record.target_email
                )

            return Response(
                {
                    "message": "OTP sent successfully. Please check your new email address."
                },
                status=status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "message": "Unable to send verification OTP. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class VerifyChangeEmailView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = VerifyChangeEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        submitted_otp = serializer.validated_data["otp"]

        try:
            with transaction.atomic():

                user = User.objects.select_for_update().get(
                    pk=request.user.pk
                )

                # Retrieve the pending Change Email OTP.
                otp_record = (
                    EmailOtp.objects
                    .select_for_update()
                    .filter(
                        user=user,
                        purpose=EmailOtp.Purpose.CHANGE_EMAIL,
                        is_used=False
                    )
                    .order_by("-created_at")
                    .first()
                )

                if not otp_record:
                    return Response(
                        {"otp": "No active email change OTP found."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                target_email = otp_record.target_email

                if not target_email:
                    return Response(
                        {"otp": "Invalid email change request."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Verify OTP.
                is_valid, message = verify_otp(
                    user=user,
                    submitted_otp=submitted_otp,
                    purpose=EmailOtp.Purpose.CHANGE_EMAIL
                )

                if not is_valid:
                    return Response(
                        {"otp": message},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Update the actual account email.
                user.email = target_email
                user.save(update_fields=["email"])

            return Response(
                {
                    "message": "Email address changed successfully.",
                    "email": user.email
                },
                status=status.HTTP_200_OK
            )

        except IntegrityError:
            return Response(
                {
                    "email": "This email address is already registered."
                },
                status=status.HTTP_400_BAD_REQUEST
            )



class ResendChangeEmailOTPView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            with transaction.atomic():

                user = User.objects.select_for_update().get(
                    pk=request.user.pk
                )

                success, raw_otp, message, remaining_seconds = resend_otp(
                    user=user,
                    purpose=EmailOtp.Purpose.CHANGE_EMAIL
                )

                if not success:
                    return Response(
                        {
                            "message": message,
                            "remaining_seconds": remaining_seconds
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Retrieve the latest Change Email OTP record.
                otp_record = (
                    EmailOtp.objects
                    .filter(
                        user=user,
                        purpose=EmailOtp.Purpose.CHANGE_EMAIL,
                        is_used=False
                    )
                    .order_by("-created_at")
                    .first()
                )

                if not otp_record or not otp_record.target_email:
                    return Response(
                        {"message": "No pending email change found."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                send_otp_email(
                    user=user,
                    raw_otp=raw_otp,
                    purpose=otp_record.purpose,
                    target_email=otp_record.target_email
                )

            return Response(
                {
                    "message": message,
                    "remaining_seconds": remaining_seconds
                },
                status=status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {
                    "message": "Unable to resend OTP. Please try again."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




@method_decorator(csrf_protect, name="dispatch")
class GoogleAuthenticationView(APIView):

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):

        serializer = GoogleAuthenticationSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        google_data = serializer.validated_data["credential"]

        google_id = google_data["google_id"]
        email = google_data["email"]
        first_name = google_data["first_name"]
        last_name = google_data["last_name"]

        try:

            with transaction.atomic():

                # 1. Check whether this Google account already exists.
                user = User.objects.select_for_update().filter(
                    google_id=google_id
                ).first()

                is_new_user = False

                if user:

                    # Do not silently change an existing VECTIS email.
                    if user.email.lower() != email:
                        raise AuthenticationFailed(
                            "Your Google email has changed. Please contact support."
                        )

                else:

                    # 2. Check whether an account already exists
                    # with this verified email.
                    user = User.objects.select_for_update().filter(
                        email__iexact=email
                    ).first()

                    if user:

                        # Prevent linking a Google account already
                        # associated with another VECTIS account.
                        if user.google_id and user.google_id != google_id:
                            raise AuthenticationFailed(
                                "This email is already linked to another Google account."
                            )

                        # Link Google to the existing account.
                        user.google_id = google_id

                        # Preserve EMAIL as the authentication provider.
                        # Existing password login must continue working.
                        user.save(update_fields=["google_id"])

                    else:

                        # 3. Create a new Google account.
                        user = User(
                            email=email,
                            first_name=first_name,
                            last_name=last_name,
                            phone="",
                            role=User.Role.USER,
                            auth_provider=User.AuthProvider.GOOGLE,
                            google_id=google_id,
                            is_active=True,
                            is_email_verified=True,
                            is_profile_completed=False
                        )

                        user.set_unusable_password()
                        user.save()

                        is_new_user = True

                # 4. Check account status.
                if not user.is_active:
                    raise AuthenticationFailed(
                        "Your account has been deactivated. Please contact support."
                    )

                if not user.is_email_verified:
                    raise AuthenticationFailed(
                        "Your email address is not verified."
                    )

                # 5. Generate JWT tokens.
                refresh = RefreshToken.for_user(user)

                refresh["role"] = user.role
                refresh["email"] = user.email
                refresh["first_name"] = user.first_name
                refresh["last_name"] = user.last_name
                refresh["password_reset_version"] = user.password_reset_version

                access_token = str(refresh.access_token)
                refresh_token = str(refresh)

                # 6. Serialize user information.
                user_data = UserProfileSerializer(user).data

            response = Response(
                {
                    "message": "Google authentication successful.",
                    "user": user_data,
                    "is_new_user": is_new_user,
                    "is_profile_completed": user.is_profile_completed
                },
                status=status.HTTP_200_OK
            )

            # 7. Set authentication cookies.
            response.set_cookie(
                key="access_token",
                value=access_token,
                max_age=int(
                    settings.SIMPLE_JWT[
                        "ACCESS_TOKEN_LIFETIME"
                    ].total_seconds()
                ),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/"
            )

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                max_age=int(
                    settings.SIMPLE_JWT[
                        "REFRESH_TOKEN_LIFETIME"
                    ].total_seconds()
                ),
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
                path="/"
            )

            return response

        except IntegrityError:
            return Response(
                {
                    "message": "Unable to create or link your Google account. Please try again."
                },
                status=status.HTTP_400_BAD_REQUEST
            )



class ProfileCompletionView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        if request.user.is_profile_completed:
            return Response(
                {"message": "Your profile is already completed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ProfileCompletionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        user.first_name = serializer.validated_data["first_name"]
        user.last_name = serializer.validated_data["last_name"]
        user.phone = serializer.validated_data["phone"]
        user.is_profile_completed = True

        user.save(update_fields=[
            "first_name",
            "last_name",
            "phone",
            "is_profile_completed",
            "updated_at"
        ])

        return Response(
            {
                "message": "Profile completed successfully.",
                "user": UserProfileSerializer(user).data
            },
            status=status.HTTP_200_OK
        )