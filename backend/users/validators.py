import re
from django.core.exceptions import ValidationError


class PasswordStrengthValidator:

    def validate(self,password,user=None):

        errors=[]

        if not re.search(r"[A-Z]",password):
            errors.append("At least one uppercaseletter is required")

        if not re.search(r"[a-z]",password):
            errors.append("At least one lowercaseletter is required")

        if not re.search(r"[0-9]",password):
            errors.append("At least one numericalcharacter is required")

        if not re.search(r"[^a-zA-Z0-9 ]",password):
            errors.append("At least one specialcharacter is required")

        if errors:
            raise ValidationError(errors)

    def get_help_text(self):
        return('''password must be contain at least one uppercaseletter one lowecaseletter 
                 and one specialcharacter,password need minimum 8 length of characters''')