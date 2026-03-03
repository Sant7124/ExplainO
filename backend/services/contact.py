import resend
from typing import Dict, Any
from core.config import settings

class ContactService:
    def __init__(self):
        if settings.RESEND_API_KEY:
            resend.api_key = settings.RESEND_API_KEY

    def send_contact_emails(self, name: str, email: str, subject: str, message: str) -> bool:
        if not settings.RESEND_API_KEY:
            print("Resend API key not configured. Skipping email.")
            return True
            
        try:
            print(f"DEBUG: Attempting to send admin email to {settings.ADMIN_EMAIL}...")
            # 1. Send to admin
            resend.Emails.send({
                "from": "ExplainO <onboarding@resend.dev>",
                "to": settings.ADMIN_EMAIL,
                "subject": f"New Contact Request: {subject}",
                "html": f"""
                <h3>New Contact Message</h3>
                <p><strong>Name:</strong> {name}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Subject:</strong> {subject}</p>
                <p><strong>Message:</strong></p>
                <p>{message}</p>
                """
            })
            print("DEBUG: Admin email sent.")
            
            # 2. Send confirmation to user
            print(f"DEBUG: Attempting to send confirmation email to {email}...")
            resend.Emails.send({
                "from": "ExplainO <onboarding@resend.dev>",
                "to": email,
                "subject": "We received your message - ExplainO",
                "html": f"""
                <h3>Hi {name},</h3>
                <p>Thank you for reaching out to ExplainO. We have received your message regarding '{subject}' and will get back to you shortly.</p>
                <p>Best regards,<br>The ExplainO Team</p>
                """
            })
            print("DEBUG: Confirmation email sent.")
            return True
        except Exception as e:
            print(f"ERROR: Email sending failed: {e}")
            return False

contact_service = ContactService()
