from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import AuthenticationFailed
from .services.password_reset_service import PasswordResetToken


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True,validators=[validate_password],
                                     required=True,
                                     error_messages={
                                        "required": "Password is required.",
                                        "blank": "Password cannot be empty."
                                    })
    confirm_password = serializers.CharField(write_only=True,required=True)

    class Meta:
        model = User
        fields =["first_name","last_name","email","password","confirm_password","phone"]

    def to_internal_value(self, data):

        if isinstance(data,dict):
            incoming_fields = data.keys()
            permitted_fields = self.fields.keys()

            extra_fields = incoming_fields - permitted_fields
            if extra_fields:
                raise serializers.ValidationError({
                    "non_field_errors": [
                        f"Unexpected fields in request: {', '.join(extra_fields)}"
                    ]
                })
        return super().to_internal_value(data)

    def validate(self,attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password":"passwords do not match"})
        return attrs

    def create(self,validated_data):
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)


class VerifyOTPSerializer(serializers.Serializer):

    email = serializers.EmailField(required=True)

    otp = serializers.CharField(
        required=True,
        min_length=6,
        max_length=6,
        error_messages={
            "required": "OTP is required.",
            "blank": "OTP cannot be empty.",
            "min_length": "OTP must contain exactly 6 digits.",
            "max_length": "OTP must contain exactly 6 digits."
        }
    )

    def validate_otp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError(
                "OTP must contain only digits."
            )

        return value


class ResendOTPSerializer(serializers.Serializer):

    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "Email is required.",
            "blank": "Email cannot be empty.",
            "invalid": "Enter a valid email address."
        }
    )




class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "Email is required.",
            "blank": "Email cannot be empty.",
            "invalid": "Enter a valid email address."
        }
    )

    password = serializers.CharField(
        required=True,
        write_only=True,
        error_messages={
            "required": "Password is required.",
            "blank": "Password cannot be empty."
        }
    )

    def to_internal_value(self, data):

        if isinstance(data, dict):
            incoming_fields = data.keys()
            permitted_fields = self.fields.keys()

            extra_fields = incoming_fields - permitted_fields

            if extra_fields:
                raise serializers.ValidationError({
                    "non_field_errors": [
                        f"Unexpected fields in request: {', '.join(extra_fields)}"
                    ]
                })

        return super().to_internal_value(data)


class UserSummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "phone",
            "role",
            "avatar_public_id",
            "is_email_verified"
        ]
        read_only_fields = fields



class CustomTokenRefreshSerializer(TokenRefreshSerializer):

    def validate(self, attrs):

        refresh = RefreshToken(attrs["refresh"])
        user_id = refresh.payload.get("user_id")

        user = User.objects.filter(id=user_id).first()

        if not user or not user.is_active:
            raise AuthenticationFailed(
                "User account is inactive or does not exist."
            )

        return super().validate(attrs)


class ForgotPasswordSerializer(serializers.Serializer):

    email = serializers.EmailField(
        required=True,
        error_messages={
            "required": "Email is required.",
            "blank": "Email cannot be empty.",
            "invalid": "Enter a valid email address."
        }
    )


class ResetPasswordSerializer(serializers.Serializer):

    token = serializers.CharField(required=True)

    new_password = serializers.CharField(
        write_only=True,
        validators=[validate_password]
    )

    confirm_password = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })

        try:
            token = PasswordResetToken(attrs["token"])

            user_id = token["user_id"]

            user = User.objects.get(
                id=user_id,
                is_active=True
            )

        except (TokenError, User.DoesNotExist, KeyError):
            raise serializers.ValidationError({
                "token": "Invalid or expired password reset link."
            })

        attrs["user"] = user

        return attrs