
from datetime import timedelta

from rest_framework_simplejwt.tokens import Token
from django.conf import settings


class PasswordResetToken(Token):

    token_type = "password_reset"
    lifetime = timedelta(minutes=5)



def generate_password_reset_link(user):

    token = PasswordResetToken()

    token["user_id"] = str(user.id)

    reset_token = str(token)

    print("Reset_Token:=== ", reset_token)

    reset_link = (
        f"{settings.FRONTEND_URL}/reset-password"
        f"?token={reset_token}"
    )

    return reset_link
