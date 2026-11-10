from django.core.mail import send_mail
from django.conf import settings

from users.models import EmailOtp


def send_otp_email(user, raw_otp, purpose):

    if purpose == EmailOtp.Purpose.EMAIL_VERIFY:
        subject = "Verify Your VECTIS Account"
        message = f"""
Hello {user.first_name},

Thank you for registering with VECTIS.

Your email verification OTP is: {raw_otp}

This OTP is valid for 5 minutes.

If you did not request this verification, please ignore this email.

Regards,
VECTIS Team
"""

    elif purpose == EmailOtp.Purpose.PASSWORD_RESET:
        subject = "Reset Your VECTIS Password"
        message = f"""
Hello {user.first_name},

We received a request to reset your VECTIS account password.

Your password reset OTP is: {raw_otp}

This OTP is valid for 5 minutes.

If you did not request this, please ignore this email.

Regards,
VECTIS Team
"""

    else:
        raise ValueError("Invalid OTP purpose.")

    return send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False
    )