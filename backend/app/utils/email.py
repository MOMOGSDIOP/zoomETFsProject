import smtplib
from email.message import EmailMessage

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "your_gmail_account@gmail.com"
SMTP_PASSWORD = "your_app_password"

def send_verification_email(email: str, code: str):
    msg = EmailMessage()
    msg["Subject"] = "Votre code de vérification ZoomETF"
    msg["From"] = SMTP_USERNAME
    msg["To"] = email
    msg.set_content(f"Votre code de vérification est : {code}")

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(msg)
