from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

# --- Configuration ---
# Replace the string below with your actual API Key
GOOGLE_API_KEY = "AIzaSyBGBqs7PEY-Y84S3oMWdcBJJC1R_F-po34" 
genai.configure(api_key=GOOGLE_API_KEY)

# --- CORS Middleware ---
# Allows the React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Model ---
class ChatRequest(BaseModel):
    message: str

# --- AI Persona Settings ---
# We define the AI's personality and language here
model = genai.GenerativeModel('gemini-2.0-flash')
system_instruction = (
    "You are a warm, professional, and cute pet assistant named 'PawPal'. "
    "Your target audience is new pet owners. Use a gentle, encouraging tone and feel free to use emojis 🐶🐱. "
    "If the user describes a serious medical situation or emergency, you MUST advise them to see a veterinarian immediately. "
    "Please answer all questions in English."
)

# --- Chat API Endpoint ---
@app.post("/api/chat")
async def chat_with_ai(request: ChatRequest):
    try:
        # Combine instructions with user message
        full_prompt = f"{system_instruction}\n\nOwner asks: {request.message}"
        response = model.generate_content(full_prompt)
        return {"reply": response.text}
    except Exception as e:
        print(f"Error: {e}")
        return {"reply": "Oops, PawPal is having a little trouble thinking right now. Please check your API Key or try again later~"}

# --- Health Check Endpoint ---
@app.get("/")
def read_root():
    return {"message": "PawPal Backend is running!"}