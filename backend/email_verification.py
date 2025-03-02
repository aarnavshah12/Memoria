
def send_verification_code(code):
    subject = "Verify Your Email for MEMORIA"
    body = f"""Dear Memoria User,

Thank you for signing up for Memoria! To complete your registration, please verify your email address by entering the verification code below:

Your Verification Code: [{code}]

This code will expire in 10 minutes. If you did not sign up for Memoria, please ignore this email.

Welcome to MEMORIA — where memories are just a conversation away!

Best regards,  
The MEMORIA Team

This is an automated message. Please do not reply."""
    return subject, body
