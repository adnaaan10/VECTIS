
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework.exceptions import PermissionDenied,AuthenticationFailed


class CookieJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):

        raw_token = request.COOKIES.get("access_token")

        if raw_token is None:
            return None

        self.enforce_csrf(request)

        validated_token = self.get_validated_token(raw_token)

        user = self.get_user(validated_token)

        
        token_version = validated_token.get(
            "password_reset_version"
        )

        if (
            token_version is None
            or token_version != user.password_reset_version
        ):
            raise AuthenticationFailed(
                "Your session has expired. Please log in again."
            )

        return user, validated_token

    def enforce_csrf(self, request):

        def dummy_get_response(request):
            return None

        check = CSRFCheck(dummy_get_response)

        django_request = request._request

        check.process_request(django_request)

        reason = check.process_view(
            django_request,
            None,
            (),
            {}
        )

        if reason:
            raise PermissionDenied(f"CSRF Failed: {reason}")
