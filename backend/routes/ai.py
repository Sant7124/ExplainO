from fastapi import APIRouter
from pydantic import BaseModel
from ai.llm import ask_llm

router = APIRouter()

class PromptRequest(BaseModel):
    text: str

@router.post("/ask")
def ask_ai(data: PromptRequest):
    answer = ask_llm(data.text)
    return {"response": answer}
