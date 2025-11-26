import os
import base64
import io
from PIL import Image
import google.generativeai as genai
from dotenv import load_dotenv

try:
    from langchain.agents.agent import AgentExecutor
    from langchain.agents.react.agent import create_react_agent
except ImportError:
    from langchain.agents import AgentExecutor, create_react_agent

from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain.tools import tool
from forensics import analyze_media_integrity

load_dotenv()

# --- 1. DEFINE TOOLS ---

@tool
def check_media_forensics(file_path: str):
    """Checks a video or image file for signs of manipulation/deepfakes. 
    Returns a confidence score and verdict."""
    return analyze_media_integrity(file_path)

@tool
def search_political_records(query: str):
    """Searches official political records, manifestos, and news for verifying claims."""
    api_key = os.getenv("TAVILY_API_KEY")
    search = TavilySearchResults(max_results=7, tavily_api_key=api_key)
    return search.invoke(query)

@tool
def analyze_propaganda_patterns(text: str):
    """Analyzes text for psychological manipulation, logical fallacies, 
    and emotional triggers (e.g., Fear Mongering, Whataboutism)."""
    return "Analyzed rhetorical structure. Look for: Emotional loading, 'Us vs Them' framing, and logical gaps."

@tool
def analyze_source_reputation(domain: str):
    """Searches for the credibility, bias, and fact-check history of a news domain or website. 
    Use this when the user asks to check a 'Source', 'Domain' or 'Website'."""
    api_key = os.getenv("TAVILY_API_KEY")
    search = TavilySearchResults(max_results=5, tavily_api_key=api_key)
    return search.invoke(f"site:mediabiasfactcheck.com OR site:newsguardtech.com OR site:wikipedia.org {domain} reliability bias")

# --- 2. IMAGE ANALYZER (Native Google SDK) ---
def analyze_image_content(image_data_base64):
    """
    Uses Gemini Native SDK to extract text and context from an image.
    """
    try:
        print("DEBUG: Processing Image with Gemini 2.5 Flash...")
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key: return "Error: Missing API Key."

        # Clean Base64
        if "," in image_data_base64:
            header, encoded = image_data_base64.split(",", 1)
        else:
            encoded = image_data_base64
        
        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes))

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        response = model.generate_content([
            "You are a Scam Detection Expert. Analyze this image carefully. Extract ALL visible text. Describe any logos, seals, or formatting. Is this a Police Notice, Court Order, or Fake Bill? Be detailed.", 
            image
        ])
        
        return response.text
        
    except Exception as e:
        return f"Error reading image: {str(e)}"

# --- 3. AUDIO ANALYZER (Native Google SDK) ---
def analyze_audio_content(audio_data_base64):
    """
    Sends audio directly to Gemini 2.5 Flash for transcription and analysis.
    """
    try:
        print("DEBUG: Processing Audio with Gemini 2.5 Flash...")
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key: return "Error: Missing API Key."

        if "," in audio_data_base64:
            header, encoded = audio_data_base64.split(",", 1)
        else:
            encoded = audio_data_base64
            
        audio_bytes = base64.b64decode(encoded)

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Prompt for Audio
        prompt = """
        Listen to this audio carefully.
        1. Identify the language spoken (e.g., Hindi, English, Marathi).
        2. TRANSCRIBE exactly what was said in the original language.
        3. Verify/Fact-Check the claim made in the audio.
        4. Provide a polite, spoken-style REPLY in the SAME LANGUAGE as the audio.
        
        Format the output exactly like this:
        TRANSCRIPT: [The text of what was said]
        VERDICT: [True/False/Misleading]
        REPLY: [The spoken-style response]
        LANGUAGE_TAG: [e.g., 'hi-IN' or 'en-US']
        """
        
        response = model.generate_content([
            prompt,
            {"mime_type": "audio/webm", "data": audio_bytes}
        ])
        
        return response.text
        
    except Exception as e:
        return f"Error analyzing audio: {str(e)}"

# --- 4. MAIN AGENT SETUP ---

def get_truth_agent():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    tools = [search_political_records, check_media_forensics, analyze_propaganda_patterns, analyze_source_reputation]
    
    # --- THE FIXED TEMPLATE ---
    # Note the explicit use of {tool_names} in the "Action:" line below.
    template = '''Answer the following questions as best you can. You are "TruthLens", an AI Investigator.

    You have 5 distinct modes of operation. Choose the one that fits the user's request:

    ### MODE A: DEEP INVESTIGATION (Fact Check)
    Output 6 sections (Verdict, Forensics, Narrative, Viral Risk, Counter-Narrative, Predictive Alerts).

    ### MODE B: FAMILY GUARD (Reply Generator)
    Verify first, then output a polite, respectful correction in the requested language + English translation.

    ### MODE C: SOURCE RADAR (Domain Check)
    Output Bias Rating and Factual Reporting Score.

    ### MODE D: CYBER SENTRY (Scam Detector)
    1. Use the provided image description/text.
    2. Compare against known Indian scams (Digital Arrest, UPI Fraud, Electricity KYC).
    3. Output: "SCAM PROBABILITY", "SCAM TYPE", "IMMEDIATE ACTION".
    
    ### MODE E: LEGAL LENS (Complaint Drafter)
    Identify the IT Act violation and draft a formal letter.
If the user asks to "Trace this" or "Find the origin":
    1. Search for the history of this narrative/video. Find when it first appeared online.
    2. Identify key resurgence points (when it went viral again).
    3. Output a chronological list in this specific format:
       TIMELINE_EVENT: [Date] | [Event Description] | [Source/Context]
       TIMELINE_EVENT: [Date] | [Event Description] | [Source/Context]
       (Repeat for 3-5 key events)
    4. Final Verdict: Is this "Recycled Content"?

  
    You have access to the following tools:

    {tools}

    Use the following format EXACTLY:

    Question: the input question you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action (CRITICAL: Use SHORT KEYWORDS only.)
    Observation: the result of the action
    ... (this Thought/Action/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: [YOUR FINAL OUTPUT BASED ON THE MODE]

    Begin!

    Question: {input}
    Thought:{agent_scratchpad}'''

    prompt = PromptTemplate.from_template(template)
    
    # Create the agent using the fixed template
    agent = create_react_agent(llm, tools, prompt)
    
    return AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True, 
        handle_parsing_errors=True,
        return_intermediate_steps=True
    )