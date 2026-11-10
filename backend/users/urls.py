from django.urls import path
from .views import RegisterUserView,VerifyEmailView

urlpatterns =[
    path("auth/register/",RegisterUserView.as_view(),name="register"),
    path("auth/email/verify/",VerifyEmailView.as_view(),name="verify-email"),
]