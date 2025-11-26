# backend/test_vision.py
import os
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Load Keys
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

print("--- DIAGNOSTIC START ---")
if not api_key:
    print("❌ ERROR: GOOGLE_API_KEY is missing from .env file or environment.")
    exit()
else:
    print(f"✅ API Key found: {api_key[:5]}...{api_key[-4:]}")

# 2. Test Connection
try:
    genai.configure(api_key=api_key)
    print("✅ Google GenAI Configured.")
    
    # 3. List Available Models
    print("--- Checking Available Models ---")
    found_flash = False
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - Found: {m.name}")
            if "flash" in m.name:
                found_flash = True
    
    if not found_flash:
        print("❌ WARNING: 'gemini-1.5-flash' model not found in your account.")
    else:
        print("✅ 'gemini-1.5-flash' is available.")

    # 4. Test Simple Text Generation
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content("Hello, are you working?")
    print(f"✅ Text Test Response: {response.text}")

except Exception as e:
    print(f"❌ CRITICAL ERROR: {e}")

print("--- DIAGNOSTIC END ---")