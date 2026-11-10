from django.urls import path
from .views import RegisterUserView, VerifyEmailView, ResendOTPView

urlpatterns = [
    path("auth/register/", RegisterUserView.as_view(), name="register"),
    path("auth/email/verify/", VerifyEmailView.as_view(), name="verify-email"),
    path("auth/email/resend-otp/", ResendOTPView.as_view(), name="resend-otp"),
]
