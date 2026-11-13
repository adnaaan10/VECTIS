from django.db import transaction

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.conf import settings

from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenRefreshSerializer

from .serializers import UserSerializer, VerifyOTPSerializer, ResendOTPSerializer,LoginSerializer,UserProfileSerializer
from .models import EmailOtp, User
from .services.otp_service import create_otp_record, verify_otp, resend_otp
from .services.email_service import send_otp_email, send_reset_password_mail
from .services.password_reset_service import generate_password_reset_link

from .serializers import ForgotPasswordSerializer,ResetPasswordSerializer

from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

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
                    "message": "If an eligible account exists, a password reset OTP has been sent."
                },
                status=status.HTTP_200_OK
            )

        reset_link = generate_password_reset_link(user)

        send_reset_password_mail(user, reset_link)
        

        return Response(
            {
                "message": "If an eligible account exists, a password reset OTP has been sent."
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

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save(update_fields=["password"])

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



class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = UserProfileSerializer(request.user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )
