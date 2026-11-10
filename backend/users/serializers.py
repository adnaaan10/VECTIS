from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


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
        