from django.db import models
import uuid
from .managers import UserManager
from django.contrib.auth.models import(
    AbstractBaseUser,PermissionsMixin
)


class User(AbstractBaseUser,PermissionsMixin):

    class Role(models.TextChoices):
        ADMIN = "ADMIN","admin"
        USER = "USER","user"

    class AuthProvider(models.TextChoices):
        EMAIL = "EMAIL","email"
        GOOGLE = "GOOGLE","google"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
        )

    email = models.EmailField(
        unique=True,
        db_index=True
    )

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100,
    )

    phone = models.CharField(
        max_length=20
    )

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER
    )

    avatar_public_id = models.CharField(max_length=255,null=True,blank=True)
    auth_provider = models.CharField(
        max_length=10,
        choices=AuthProvider.choices,
        default=AuthProvider.EMAIL
    )
    google_id = models.CharField(max_length=255,unique=True,null=True,blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name","last_name","phone"]

    def __str__(self):
        return self.email


class EmailOtp(models.Model):

    class Purpose(models.TextChoices):
        EMAIL_VERIFY="EMAIL_VERIFY","email_verify"
        PASSWORD_RESET="PASSWORD_RESET","password_reset"

    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="emailotps")
    otp_hash=models.CharField(max_length=255)
    purpose=models.CharField(
        choices=Purpose.choices,
        default=Purpose.EMAIL_VERIFY,
        max_length=20
    )
    expires_at=models.DateTimeField()
    attempts=models.PositiveIntegerField(default=0)
    resend_count=models.PositiveIntegerField(default=0)
    last_sent_at=models.DateTimeField(null=True,blank=True)
    is_used=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)





    
