from django.db import models
import uuid
from .managers import UserManager
from django.contrib.auth.models import(
    AbstractBaseUser,PermissionsMixin
)
from django.conf import settings


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
        max_length=20,
        blank=True,
        default=""
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
    password_reset_version = models.PositiveIntegerField(default=0)
    is_profile_completed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name","last_name","phone"]

    def __str__(self):
        return self.email


class EmailOtp(models.Model):

    class Purpose(models.TextChoices):
        EMAIL_VERIFICATION = "EMAIL_VERIFICATION", "Email Verification"
        CHANGE_EMAIL = "CHANGE_EMAIL", "Change Email"


    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="emailotps")
    otp_hash=models.CharField(max_length=255)
    purpose = models.CharField(
        max_length=30,
        choices=Purpose.choices,
        default=Purpose.EMAIL_VERIFICATION
    )
    target_email = models.EmailField(
        null=True,
        blank=True
    )
    expires_at=models.DateTimeField()
    attempts=models.PositiveIntegerField(default=0)
    resend_count=models.PositiveIntegerField(default=0)
    last_sent_at=models.DateTimeField(null=True,blank=True)
    is_used=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now_add=True)




class Address(models.Model):

    class AddressType(models.TextChoices):
        HOME = "HOME", "Home"
        WORK = "WORK", "Work"
        OTHER = "OTHER", "Other"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="addresses"
    )

    address_type = models.CharField(
        max_length=10,
        choices=AddressType.choices,
        default=AddressType.HOME
    )

    full_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)

    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(
        max_length=255,
        blank=True
    )

    landmark = models.CharField(
        max_length=150,
        blank=True
    )

    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=10)
    country = models.CharField(
        max_length=100,
        default="India"
    )

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_default", "-created_at"]

        constraints = [
            models.UniqueConstraint(
                fields=["user"],
                condition=models.Q(is_default=True),
                name="unique_default_address_per_user"
            )
        ]

    def __str__(self):
        return f"{self.full_name} - {self.city}"

    
