import asyncio
import smtplib
from email.mime.text import MIMEText
from app.core.settings import settings

async def send_email_with_code(to_email: str, code: str):
    subject = "Votre code de connexion ZoomETF"
    body = f"Voici votre code de connexion : {code}\nIl est valable 5 minutes."

    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = settings.EMAIL_FROM
    msg['To'] = to_email

    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, send_email_sync, msg, to_email)

def send_email_sync(msg, to_email):
    try:
        print(f"Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}")
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()

            # STARTTLS uniquement si configuré
            if settings.SMTP_USE_TLS:
                print("Starting TLS...")
                server.starttls()
                server.ehlo()

            # Login uniquement si user/pass sont définis
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                print(f"Logging in as {settings.SMTP_USER}")
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

            server.send_message(msg, from_addr=msg['From'], to_addrs=[to_email])
            print(f"Email envoyé à {to_email}")

    except Exception as e:
        print(f"Erreur lors de l'envoi de l'email : {e}")
