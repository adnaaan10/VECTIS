from django.urls import path
from . import views

urlpatterns = [
    path("auth/register/", views.RegisterUserView.as_view(), name="register"),
    path("auth/email/verify/", views.VerifyEmailView.as_view(), name="verify-email"),
    path("auth/email/resend-otp/", views.ResendOTPView.as_view(), name="resend-otp"),
    path("auth/login/", views.LoginView.as_view(), name="login"),
    path("auth/token/refresh/", views.CustomTokenRefreshView.as_view(),name="token_refresh"),
    path("auth/forgot-password/", views.ForgotPasswordView.as_view(),name="forgot-password"),
    path("auth/reset-password/", views.ResetPasswordView.as_view(),name="reset-password"),
    path("auth/csrf/",views.csrf_token_view,name="csrf-token"),
    path("auth/logout/",views.LogoutView.as_view(),name="logout"),
    path("auth/me/",views.CurrentUserView.as_view(),name="current-user"),
]
