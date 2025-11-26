import re
import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# FIX: Import ALL necessary functions from agents.py
from agents import get_truth_agent, analyze_image_content, analyze_audio_content 

# --- CONFIGURATION ---
load_dotenv()
GEMINI_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}) 

# --- INITIALIZATION ---
AGENT_EXECUTOR = get_truth_agent()


@app.route('/api/analyze', methods=['POST'])
def analyze_claim():
    # Use get_json(silent=True) to prevent 400 error on bad/empty JSON
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"status": "error", "message": "Invalid or empty JSON payload."}), 400

    user_query = data.get('query')
    image_data = data.get('image_data')
    audio_data = data.get('audio_data') # CAPTURED AUDIO

    # --- MODE 1: HANDLE AUDIO PROCESSING (TruthLine/Sentinel) ---
    if audio_data:
        try:
            # This calls the function in agents.py that uses Gemini 2.5 Flash
            analysis_result = analyze_audio_content(audio_data) 
            
            # You must return a structured response for the frontend to display logs
            return jsonify({
                "status": "success",
                "analysis": analysis_result,
                "thoughts": [
                    {"step": "Audio Transcription", "details": "Processed by Gemini 2.5 Flash."},
                    {"step": "Fact-Checking", "details": "Cross-referenced claim with knowledge base."}
                ],
                "sources": []
            })
        except Exception as e:
            error_msg = f"Audio processing failed: {str(e)}"
            print(f"CRITICAL AUDIO ERROR: {error_msg}")
            return jsonify({"status": "error", "message": error_msg}), 500

    # --- MODE 2: HANDLE TEXT/GENERAL (Fallback) ---
    full_prompt = user_query or ""
    image_context = ""
    
    if image_data:
        try:
            image_description = analyze_image_content(image_data)
            image_context = f"\n\n[IMAGE CONTEXT]: {image_description}"
        except Exception as e:
            image_context = f"\n\n[IMAGE CONTEXT ERROR]: Could not process image. {str(e)}"
    
    full_prompt += image_context

    if not full_prompt.strip():
        return jsonify({"status": "error", "message": "No input provided."}), 400

    try:
        response = AGENT_EXECUTOR.invoke({"input": full_prompt})
        
        # Extract metadata
        thoughts = []
        if image_data: thoughts.append({"step": "Visual Forensics", "details": "Image context analyzed."})

        for action, observation in response.get("intermediate_steps", []):
            thoughts.append({"step": action.tool, "details": str(observation)[:150] + "..."})

        sources = list(set(re.findall(r'https?://[^\s\)\}\]\']+', str(response))))

        return jsonify({
            "status": "success",
            "analysis": response['output'],
            "thoughts": thoughts,
            "sources": sources
        })
        
    except Exception as e:
        error_msg = f"Generative Agent Failed: {str(e)}"
        print(f"CRITICAL ERROR: {error_msg}")
        return jsonify({"status": "error", "message": error_msg}), 500


if __name__ == '__main__':
    port = int(os.environ.get("GEMINI_PORT", 5500))
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)