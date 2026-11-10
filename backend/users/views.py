from django.db import transaction

from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import UserSerializer, VerifyOTPSerializer, ResendOTPSerializer
from .models import EmailOtp, User
from .services.otp_service import create_otp_record, verify_otp, resend_otp
from .services.email_service import send_otp_email



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
            EmailOtp.Purpose.EMAIL_VERIFY
        )

        send_otp_email(
            user,
            raw_otp,
            EmailOtp.Purpose.EMAIL_VERIFY
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
            EmailOtp.Purpose.EMAIL_VERIFY
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
            EmailOtp.Purpose.EMAIL_VERIFY
        )

        if not is_sent:
            return Response(
                {"message": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        send_otp_email(
            user,
            raw_otp,
            EmailOtp.Purpose.EMAIL_VERIFY
        )

        return Response(
            {"message": "OTP resent successfully. Please check your email."},
            status=status.HTTP_200_OK
        )
