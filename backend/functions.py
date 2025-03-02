import smtplib
import random
from email.mime.text import MIMEText

def generate_code():
    code = ""
    for i in range(6):
        code += str(random.randint(0,9))
    return code

def send_email(rec_email, subject, body):
    SENDER_EMAIL = "noreply.memoria@gmail.com"
    PWD = "flss bubc lrww dthm"

    msg = MIMEText(body, 'plain', 'utf-8')
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg['To'] = rec_email

    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
        connection.starttls()
        connection.login(SENDER_EMAIL, PWD)
        connection.sendmail(SENDER_EMAIL, rec_email, msg.as_string())

def check_code(user_entry, correct_code):
    return user_entry == correct_code