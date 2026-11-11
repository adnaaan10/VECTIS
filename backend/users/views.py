from django.db import transaction

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from .serializers import CustomTokenRefreshSerializer

from .serializers import UserSerializer, VerifyOTPSerializer, ResendOTPSerializer,LoginSerializer,UserSummarySerializer
from .models import EmailOtp, User
from .services.otp_service import create_otp_record, verify_otp, resend_otp
from .services.email_service import send_otp_email, send_reset_password_mail
from .services.password_reset_service import generate_password_reset_link

from .serializers import ForgotPasswordSerializer


from .serializers import ResetPasswordSerializer

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
            EmailOtp.Pur
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

        is_sent, raw_otp, message = resend_otp(
            user,
        )

        if not is_sent:
            return Response(
                {"message": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        send_otp_email(
            user,
            raw_otp,
        )

        return Response(
            {"message": "OTP resent successfully. Please check your email."},
            status=status.HTTP_200_OK
        )

from .serializers import LoginSerializer


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

       
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)

        refresh["role"] = user.role
        refresh["email"] = user.email
        refresh["first_name"] = user.first_name
        refresh["last_name"] = user.last_name

        user_data = UserSummarySerializer(user).data

        return Response(
            {
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": user_data
            },
            status=status.HTTP_200_OK
        )


class CustomTokenRefreshView(TokenRefreshView):

    serializer_class = CustomTokenRefreshSerializer
    permission_classes = [AllowAny]
    authentication_classes = []



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



