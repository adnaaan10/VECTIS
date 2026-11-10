import secrets
from django.contrib.auth.hashers import make_password,check_password
from django.utils import timezone
from datetime import timedelta
from users.models import EmailOtp
from django.db import transaction

def generate_otp():
    raw_otp = f"{secrets.randbelow(1_000_000):06d}"
    hashed_otp = make_password(raw_otp)

    return raw_otp, hashed_otp


def create_otp_record(user, purpose):
    raw_otp, hashed_otp = generate_otp()

    current_time = timezone.now()

    otp_record = EmailOtp.objects.create(
        user=user,
        otp_hash=hashed_otp,
        purpose=purpose,
        expires_at=current_time + timedelta(minutes=5),
        attempts=0,
        resend_count=0,
        last_sent_at=current_time,
        is_used=False
    )

    return raw_otp, otp_record

def verify_otp(user, submitted_otp, purpose):

    with transaction.atomic():

        otp_record = (
            EmailOtp.objects
            .select_for_update()
            .filter(
                user=user,
                purpose=purpose
            )
            .order_by("-created_at")
            .first()
        )

        if not otp_record:
            return False, "No active OTP found."

        if otp_record.is_used:
                    return False, "OTP has already been used."
        

        if otp_record.expires_at <= timezone.now():
            return False, "OTP has expired."

        if otp_record.attempts >= 5:
            return False, "Maximum attempts exceeded. Request a new OTP."

    
        if not check_password(submitted_otp, otp_record.otp_hash):
            otp_record.attempts += 1
            otp_record.save(update_fields=["attempts"])

            if otp_record.attempts >= 5:
                return False, "Maximum attempts exceeded. Request a new OTP."

            return False, "Invalid OTP."

        otp_record.is_used = True
        otp_record.save(update_fields=["is_used"])

        return True, "OTP verified successfully."