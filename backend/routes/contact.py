from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from services.contact import contact_service
from services.logger import log_event

router = APIRouter(prefix="/api/v1")

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

def send_emails_background(name: str, email: str, subject: str, message: str):
    log_event("ContactRoute", f"Background: Starting email transmission for {name}")
    success = contact_service.send_contact_emails(
        name=name,
        email=email,
        subject=subject,
        message=message
    )
    if success:
        log_event("ContactRoute", f"Background: Emails sent successfully for {name}")
    else:
        log_event("ContactRoute", f"Background: Email transmission failed for {name}", level="ERROR")

@router.post("/contact")
async def contact_form_submission(request: ContactRequest, background_tasks: BackgroundTasks):
    """
    Endpoint for contact form submissions.
    Sends notification to admin and confirmation to user in the background.
    """
    log_event("ContactRoute", f"Received message from {request.name} ({request.email}). Offloading to background.")
    
    background_tasks.add_task(
        send_emails_background,
        request.name,
        request.email,
        request.subject,
        request.message
    )
    
    return {"message": "Your msg is sent to the developer, soon he will be contact to U"}
