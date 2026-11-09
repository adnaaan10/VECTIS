from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):

    def _create_user(self, email, password=None, **extra_fields):

        if not email or not email.strip():
            raise ValueError("Email address is required.")

        email = self.normalize_email(email).lower()

        user = self.model(
            email=email,
            **extra_fields
        )

        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.save(using=self._db)

        return user

    def create_user(self, email, password=None, **extra_fields):

        role = extra_fields.pop("role", "USER")

        if role != "USER":
            raise ValueError("Normal users must have USER role.")

        if extra_fields.get("is_staff", False):
            raise ValueError("Normal users cannot have staff privileges.")

        if extra_fields.get("is_superuser", False):
            raise ValueError("Normal users cannot have superuser privileges.")

        extra_fields["role"] = "USER"
        extra_fields["is_staff"] = False
        extra_fields["is_superuser"] = False

        return self._create_user(
            email,
            password,
            **extra_fields
        )

    def create_superuser(self, email, password=None, **extra_fields):

        if not password:
            raise ValueError("Superuser password is required.")

        extra_fields.setdefault("role", "ADMIN")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_email_verified", True)

        if extra_fields.get("role") != "ADMIN":
            raise ValueError("Superuser must have ADMIN role.")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        if extra_fields.get("is_active") is not True:
            raise ValueError("Superuser must have is_active=True")

        if extra_fields.get("is_email_verified") is not True:
            raise ValueError("Superuser must have is_email_verified=True")

        return self._create_user(
            email,
            password,
            **extra_fields
        )

