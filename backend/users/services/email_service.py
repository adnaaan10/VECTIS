from django.core.mail import send_mail
from django.conf import settings

from users.models import EmailOtp


def send_otp_email(user, raw_otp):

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

    return send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False
    )

def send_reset_password_mail(user, reset_link):

    subject = "Reset Your VECTIS Password"
    message = f"""
    Hello {user.first_name},
    
    We received a request to reset your VECTIS account password.
    
    Your password reset Link is: {reset_link}
    
    This Link is valid for 5 minutes.
    
    If you did not request this, please ignore this email.
    
    Regards,
    VECTIS Team
    """

    return send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False
        )