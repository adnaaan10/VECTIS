
from datetime import timedelta
from urllib.parse import urlencode
from django.db import transaction
from ..models import User

from rest_framework_simplejwt.tokens import Token
from django.conf import settings


class PasswordResetToken(Token):

    token_type = "password_reset"
    lifetime = timedelta(minutes=5)



def generate_password_reset_link(user):

    with transaction.atomic():

        locked_user = User.objects.select_for_update().get(
            id=user.id
        )

        locked_user.password_reset_version+=1
        locked_user.save(
            update_fields=["password_reset_version"]
        )
        
        token = PasswordResetToken()

        token["user_id"] = str(locked_user.id)
        token["reset_version"] = locked_user.password_reset_version

        reset_token = str(token)

        query_string = urlencode({
            "token": reset_token
        })

        print("Reset_Token:=== ", reset_token)

        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password"
            f"?{query_string}"
        )

    return reset_link
