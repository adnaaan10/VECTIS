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
    path("auth/me/",views.UserProfileView.as_view(),name="user-profile"),
    path("auth/me/avatar/",views.UserAvatarView.as_view(),name="user-avatar"),
    path("admin/users/",views.AdminUserListView.as_view(),name="admin-user-list"),
    path("admin/users/<uuid:user_id>/<str:action>/",views.AdminUserStatusView.as_view(),name="admin-user-status"),
    path("addresses/",views.AddressListCreateView.as_view(),name="address-list-create"),
    path("addresses/<uuid:id>/",views.AddressDetailView.as_view(),name="address-detail"),
    path("addresses/<uuid:id>/default/",views.SetDefaultAddressView.as_view(),name="address-set-default"),
    path("auth/change-password/",views.ChangePasswordView.as_view(),name="change-password"),
    path("auth/change-email/",views.ChangeEmailView.as_view(),name="change-email"),
    path("auth/verify-change-email/",views.VerifyChangeEmailView.as_view(),name="verify-change-email"),
    path("auth/resend-change-email-otp/",views.ResendChangeEmailOTPView.as_view(),name="resend-change-email-otp"),
]
