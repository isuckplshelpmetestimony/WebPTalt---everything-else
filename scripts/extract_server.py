#!/usr/bin/env python3
"""
Ollama Extraction HTTP Server
Simple Flask server that provides data extraction via Ollama LLM.
Run this server before starting the Next.js application (along with transcription server).
"""

import os
import sys
import json
import traceback
import re
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Ollama API endpoint (default: localhost:11434)
OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://127.0.0.1:11434')
# Default model (llama3.2 is smaller and faster, good for extraction)
DEFAULT_MODEL = os.getenv('OLLAMA_MODEL', 'llama3.2')

# Store last transcript and extracted data for debugging
last_transcript = None
last_extracted_data = None

def get_extraction_prompt(transcript: str) -> dict:
    """Generate the extraction prompt for Ollama."""
    system_prompt = """You are a medical documentation assistant. Your task is to extract structured data from a physical therapy initial evaluation transcript.

The transcript contains a conversation between a therapist and patient covering multiple subjective assessment sections. You need to identify which parts of the transcript relate to each section and extract the relevant information.

CRITICAL EXTRACTION PRINCIPLES:
- Extract ALL relevant information, including context and narrative details. DO NOT simplify or summarize.
- If information belongs to multiple sections, extract it to ALL relevant sections (e.g., pain information mentioned in chief complaint should also appear in Pain History).
- Look for information embedded in longer responses, not just direct answers to questions.
- Capture comprehensive descriptions for narrative fields, not just keywords.

Extract data for ALL of the following sections:
1. Current Condition (chief complaint, onset date, type of injury, specific injury, additional injury details, surgery info, occupation, treatments)
   - chiefComplaint: Extract a COMPREHENSIVE description including: the main complaint, duration, mechanism of injury (if mentioned), pain characteristics, aggravating factors, onset quality, and any relevant context.
     * CRITICAL: Extract ALL sentences and phrases that describe the condition, not just the first sentence. If the patient describes pain characteristics, aggravating factors, or other details in follow-up sentences, include them in the chief complaint.
     * Onset quality (sudden, gradual, sharp, dull) can appear in any response - include it in chief complaint even if mentioned in type-of-injury section or other sections. If patient describes being "fine before" or "sudden onset", include this in chief complaint.
     * Example transcript: "I have back pain. It started after lifting. The pain is constant when sitting."
     * Expected extraction: "Back pain, started after lifting, constant pain when sitting"
     * Example: "Lower back pain for 3 weeks, started after lifting heavy box at work, constant pain especially when sitting or bending over, sudden sharp onset, patient was fine before that day"
   - typeOfInjury: Should be ONLY "acute", "chronic", or "post-surgical" (based on the question about injury type)
   - specificInjury: Should be ONE of these exact values: "strain", "sprain", "fracture", or "dislocation". Map the injury type mentioned to the closest option (e.g., "lumbar strain" → "strain", "ankle sprain" → "sprain")
   - additionalInjuryDetails: Extract any additional clinical details mentioned about the injury such as: radiculopathy, nerve involvement, radiation patterns (e.g., "pain goes down right leg"), numbness, tingling, or other modifiers. This captures information beyond the basic injury type.
   - occupation: Extract the job title AND any relevant work demands or physical requirements mentioned (e.g., "construction site supervisor, does a lot of walking and lifting materials")
   - treatmentsRelated: Extract as an array ALL treatments the patient tried for THIS condition. Include: healthcare visits (urgent care, ER, doctor visits), prescribed medications (muscle relaxers, pain medications), over-the-counter treatments, physical therapy, rest recommendations, ice/heat, etc. Examples: ["urgent care visit", "muscle relaxers", "rest", "over-the-counter pain medication"]. If treatment effectiveness is mentioned (e.g., "hasn't helped much"), include it in the treatment description.
   - This is DIFFERENT from medications in medical history - treatmentsRelated are treatments tried for the CURRENT condition
2. Depression Screening (bipolar disorder, screening performed, PHQ-2 questions, results, tool used, follow-up plan)
3. Social Drivers of Health (age check, screening performed, food insecurity questions, housing, transportation, utilities, safety, tool used, results, comments)
4. Elder Maltreatment (screening performed, 5 abuse questions, results, tool used, follow-up plan)
5. Falls (falls history, fall details)
6. BMI (height, weight, calculated BMI)
7. Urinary Incontinence (screening performed, 4 screening questions, results, assessment notes)
8. Dementia Assessment (assessment performed, 5 assessment questions, results, support plan, notes)
9. Diabetes (has diabetes, type, medications, complications)
10. Pain History (pain areas with current/best/worst ratings, pain descriptions with activity/time, symptoms, description, comments)
   - IMPORTANT: Extract pain information from ANY section of the transcript, not just explicit pain history questions. If pain is mentioned in chief complaint or other sections, also extract it here.
   - painDescriptions: Extract radiation patterns (e.g., "goes down leg", "radiates to arm"), nerve symptoms (numbness, tingling, radiculopathy), and aggravating factors (e.g., "worse when sitting", "worse when bending")
   - symptoms: Can include free text describing symptoms like "pain goes down right leg", "numbness in fingers", etc.
   - description: Use "Radiates" if radiation is mentioned, or other appropriate descriptors
   - comments: Capture any additional pain-related information
11. Functional Status (activities with difficulty/assistance, restrictions, last date worked, comments)
12. Medical History (surgery history with date/type/outcome, medical conditions with system, medications with name/dosage/frequency/route)
   - CRITICAL: Extract ALL past surgeries, medical conditions, and medications mentioned, EVEN IF they are unrelated to the current condition. The patient may say "for a different issue" but it should still be extracted.

CRITICAL SCHEMA REQUIREMENT: You MUST use this EXACT JSON structure. Do NOT create your own structure or rename these sections. The top-level keys MUST be exactly: "current-condition", "depression", "social-drivers", "elder-maltreatment", "falls", "bmi", "urinary-incontinence", "dementia", "diabetes", "pain-history", "functional-status", "medical-history".

Return ONLY valid JSON matching this exact schema. Do not include any text before or after the JSON. The JSON must be valid and parseable.

{
  "current-condition": {
    "chiefComplaint": "string or null",
    "onsetDate": "string or null",
    "typeOfInjury": "string or null",
    "specificInjury": "string or null",
    "additionalInjuryDetails": "string or null",
    "surgeryDate": "string or null",
    "surgeryType": "string or null",
    "occupation": "string or null",
    "treatmentsRelated": ["string"] or null
  },
  "depression": {
    "hasBipolarDisorder": "yes|no|null",
    "screeningPerformed": "yes|no|null",
    "screeningQuestion1": "string or null",
    "screeningQuestion2": "string or null",
    "screeningResults": "positive|negative|null",
    "screeningToolDescription": "string or null",
    "followUpPlan": ["string"] or null
  },
  "social-drivers": {
    "is18OrGreater": true|false|null,
    "notDocumented": true|false|null,
    "screeningPerformed": "yes|no|null",
    "foodInsecurity1": "yes|no|null",
    "foodInsecurity2": "yes|no|null",
    "housing": "stable|unstable|homeless|null",
    "transportation": "yes|no|null",
    "utilities": "yes|no|null",
    "safety": "never|rarely|sometimes|often|null",
    "screeningToolUsed": "string or null",
    "results": "positive|negative|null",
    "comments": "string or null"
  },
  "elder-maltreatment": {
    "screeningPerformed": "yes|no|null",
    "abuseQuestion1": "yes|no|null",
    "abuseQuestion2": "yes|no|null",
    "abuseQuestion3": "yes|no|null",
    "abuseQuestion4": "yes|no|null",
    "abuseQuestion5": "yes|no|null",
    "screeningResults": "positive|negative|null",
    "toolDescription": "string or null",
    "followUpPlanDocumented": "yes|no|null"
  },
  "falls": {
    "hasFallsHistory": "yes|no|null",
    "fallDetails": "string or null"
  },
  "bmi": {
    "height": "string or null",
    "weight": "string or null",
    "bmi": number or null
  },
  "urinary-incontinence": {
    "screeningPerformed": "yes|no|null",
    "incontinenceQuestion1": "yes|no|null",
    "incontinenceQuestion2": "yes|no|null",
    "incontinenceQuestion3": "string or null",
    "incontinenceQuestion4": "string or null",
    "screeningResults": "positive|negative|null",
    "assessmentNotes": "string or null"
  },
  "dementia": {
    "assessmentPerformed": "yes|no|null",
    "memoryQuestion1": "yes|no|null",
    "memoryQuestion2": "yes|no|null",
    "orientationQuestion1": "string or null",
    "orientationQuestion2": "string or null",
    "functionQuestion": "yes|no|null",
    "assessmentResults": "positive|negative|null",
    "supportPlan": "string or null",
    "notes": "string or null"
  },
  "diabetes": {
    "hasDiabetes": "yes|no|null",
    "diabetesType": "string or null",
    "medications": "string or null",
    "complications": "string or null"
  },
  "pain-history": {
    "painAreas": [{"area": "string", "current": "string", "best": "string", "worst": "string"}] or null,
    "painDescriptions": [{"area": "string", "activityTime": "string", "symptoms": "string", "description": "string"}] or null,
    "comments": "string or null"
  },
  "functional-status": {
    "activities": [{"activity": "string", "difficulty": "string", "assistance": "string"}] or null,
    "restrictions": "string or null",
    "lastDateWorked": "string or null",
    "comments": "string or null"
  },
  "medical-history": {
    "surgeryHistory": [{"date": "string", "type": "string", "outcome": "string"}] or null,
    "medicalConditions": [{"condition": "string", "system": "string"}] or null,
    "medications": [{"name": "string", "dosage": "string", "frequency": "string", "routeOfAdministration": "string"}] or null
  }
}

Important extraction rules:
- If information is not mentioned in the transcript, use null for that field
- Extract dates in natural format (e.g., "3 weeks ago", "January 2024", "2024-01-15")
- For pain ratings, extract numbers (e.g., "7 out of 10" → "7/10")
- For yes/no questions, extract "yes" or "no" only
- Extract all relevant information including context - do not oversimplify narrative fields
- For current-condition.chiefComplaint: Extract the ENTIRE patient description, including ALL pain characteristics, aggravating factors, and onset details mentioned anywhere in the transcript. Extract ALL sentences describing the condition, not just the first one. When in doubt, include MORE detail rather than less. Do NOT simplify to just keywords.
- For current-condition.typeOfInjury: Extract ONLY the category ("acute", "chronic", or "post-surgical"). Do NOT include specific diagnosis details here.
- For current-condition.specificInjury: Must be ONE of these exact values: "strain", "sprain", "fracture", or "dislocation". Map the injury mentioned to the closest match (e.g., "lumbar strain" or "strain" → "strain", "ankle sprain" → "sprain"). If no clear match, use null.
- For current-condition.additionalInjuryDetails: Extract radiculopathy, nerve involvement, radiation patterns, numbness, tingling, or other clinical modifiers mentioned. Example: "possibly with some radiculopathy, pain sometimes goes down right leg"
- For current-condition.occupation: Include job title AND work demands/physical requirements if mentioned (e.g., "construction site supervisor, does a lot of walking and lifting materials")
- For current-condition.treatmentsRelated: Extract ALL treatments including healthcare visits (urgent care, ER, doctor visits), prescribed medications, OTC treatments, therapies, recommendations. Include timing/context if mentioned (e.g., "urgent care visit (right after injury)"). Include effectiveness if mentioned (e.g., "over-the-counter pain medication (hasn't helped much)"). Examples: ["urgent care visit", "muscle relaxers", "rest", "over-the-counter pain medication"]
- For pain-history: Extract pain information from ANY section, not just explicit pain questions. If pain radiation is mentioned in chief complaint (e.g., "pain goes down leg"), also extract it to pain-history.painDescriptions. Capture radiation patterns, nerve symptoms, and aggravating factors.
- For medical-history: Extract ALL past surgeries, conditions, and medications, even if patient says "for a different issue" or "unrelated". Medical history should be comprehensive. Example: If patient says "knee surgery in 2020 for a different issue", extract: {"date": "2020", "type": "knee surgery", "outcome": "for different issue"} to medical-history.surgeryHistory.
- Return ONLY the JSON object, no markdown code blocks, no explanations, just valid JSON"""

    user_prompt = f"""Extract structured data from this transcript:

{transcript}

CRITICAL: You MUST return JSON that EXACTLY matches the schema structure shown above. Use the EXACT section names: "current-condition", "depression", "social-drivers", "elder-maltreatment", "falls", "bmi", "urinary-incontinence", "dementia", "diabetes", "pain-history", "functional-status", "medical-history". Do NOT create your own section names or structure. Return ONLY the JSON object with these exact keys."""

    return {
        "model": DEFAULT_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "stream": False,
        "format": "json"  # Request JSON format from Ollama
    }

def extract_json_from_response(text: str) -> dict:
    """Extract JSON from Ollama response, handling markdown code blocks if present."""
    # Remove markdown code blocks if present
    text = text.strip()
    
    # Try to find JSON in code blocks
    json_match = re.search(r'```(?:json)?\s*(\{.*\})\s*```', text, re.DOTALL)
    if json_match:
        text = json_match.group(1)
    
    # Try to find JSON object directly
    json_match = re.search(r'\{.*\}', text, re.DOTALL)
    if json_match:
        text = json_match.group(0)
    
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}", file=sys.stderr, flush=True)
        print(f"Response text: {text[:500]}...", file=sys.stderr, flush=True)
        raise

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    try:
        # Check if Ollama is running
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=5)
        models = response.json().get('models', [])
        model_names = [m.get('name', '') for m in models]
        return jsonify({
            "status": "ok",
            "ollama_url": OLLAMA_BASE_URL,
            "default_model": DEFAULT_MODEL,
            "available_models": model_names
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "message": "Ollama is not running or not accessible"
        }), 503

@app.route('/debug/last-extraction', methods=['GET'])
def last_extraction_debug():
    """Debug endpoint to get the last transcript and extracted data."""
    global last_transcript, last_extracted_data
    return jsonify({
        "transcript": last_transcript,
        "transcript_length": len(last_transcript) if last_transcript else 0,
        "extracted_data": last_extracted_data,
        "extracted_sections": len(last_extracted_data) if last_extracted_data else 0
    })

@app.route('/extract', methods=['POST'])
def extract():
    """Extract structured data from transcript endpoint."""
    try:
        data = request.get_json()
        transcript = data.get('transcript')
        
        if not transcript or not isinstance(transcript, str):
            return jsonify({"error": "Transcript is required"}), 400
        
        # Get model from query parameter or use default
        model = request.args.get('model', DEFAULT_MODEL)
        
        # Store transcript for debugging
        global last_transcript
        last_transcript = transcript
        
        print(f"Extracting data using model: {model}...", file=sys.stderr, flush=True)
        print(f"\n{'='*80}", file=sys.stderr, flush=True)
        print(f"TRANSCRIPT RECEIVED ({len(transcript)} characters):", file=sys.stderr, flush=True)
        print(f"{'='*80}", file=sys.stderr, flush=True)
        print(transcript, file=sys.stderr, flush=True)
        print(f"{'='*80}\n", file=sys.stderr, flush=True)
        
        # Prepare prompt
        prompt_data = get_extraction_prompt(transcript)
        prompt_data['model'] = model
        
        # Call Ollama API
        ollama_url = f"{OLLAMA_BASE_URL}/api/chat"
        print(f"Calling Ollama at {ollama_url}...", file=sys.stderr, flush=True)
        
        response = requests.post(
            ollama_url,
            json=prompt_data,
            timeout=300  # 5 minute timeout for large transcripts
        )
        
        if not response.ok:
            error_text = response.text
            print(f"Ollama API error: {error_text}", file=sys.stderr, flush=True)
            return jsonify({
                "error": f"Ollama API error: {response.status_code} - {error_text}"
            }), response.status_code
        
        result = response.json()
        content = result.get('message', {}).get('content', '')
        
        if not content:
            return jsonify({"error": "Empty response from Ollama"}), 500
        
        # Extract and parse JSON
        try:
            extracted_data = extract_json_from_response(content)
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from Ollama response: {e}", file=sys.stderr, flush=True)
            print(f"Raw content (first 500 chars): {content[:500]}", file=sys.stderr, flush=True)
            return jsonify({
                "error": f"Failed to parse JSON from Ollama response: {str(e)}"
            }), 500
        
        # Store extracted data for debugging
        global last_extracted_data
        last_extracted_data = extracted_data
        
        print(f"Extraction complete. Extracted {len(extracted_data)} sections", file=sys.stderr, flush=True)
        print(f"\n{'='*80}", file=sys.stderr, flush=True)
        print(f"EXTRACTED DATA:", file=sys.stderr, flush=True)
        print(f"{'='*80}", file=sys.stderr, flush=True)
        print(json.dumps(extracted_data, indent=2), file=sys.stderr, flush=True)
        print(f"{'='*80}\n", file=sys.stderr, flush=True)
        
        return jsonify({"extractedData": extracted_data})
        
    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Cannot connect to Ollama. Make sure Ollama is running (run 'ollama serve' if needed)."
        }), 503
    except Exception as e:
        error_msg = f"Extraction error: {str(e)}"
        print(error_msg, file=sys.stderr, flush=True)
        print(traceback.format_exc(), file=sys.stderr, flush=True)
        return jsonify({"error": error_msg}), 500

def get_section_extraction_prompt(transcript: str, section_id: str) -> dict:
    """Generate a focused extraction prompt for a single section."""
    # Section-specific schemas and instructions
    section_schemas = {
        "current-condition": {
            "schema": {
                "chiefComplaint": "string or null",
                "onsetDate": "string or null",
                "typeOfInjury": "string or null",
                "specificInjury": "string or null",
                "additionalInjuryDetails": "string or null",
                "surgeryDate": "string or null",
                "surgeryType": "string or null",
                "occupation": "string or null",
                "treatmentsRelated": ["string"] or null
            },
            "instructions": """Extract Current Condition information:
- chiefComplaint: COMPREHENSIVE description including main complaint, duration, mechanism, pain characteristics, aggravating factors, onset quality
- typeOfInjury: ONLY "acute", "chronic", or "post-surgical"
- specificInjury: ONE of "strain", "sprain", "fracture", or "dislocation"
- additionalInjuryDetails: radiculopathy, nerve involvement, radiation patterns, numbness, tingling
- occupation: job title AND work demands/physical requirements
- treatmentsRelated: ALL treatments tried for THIS condition (healthcare visits, medications, OTC, therapies)"""
        },
        "depression": {
            "schema": {
                "hasBipolarDisorder": "yes|no|null",
                "screeningPerformed": "yes|no|null",
                "screeningQuestion1": "string or null",
                "screeningQuestion2": "string or null",
                "screeningResults": "positive|negative|null",
                "screeningToolDescription": "string or null",
                "followUpPlan": ["string"] or null
            },
            "instructions": """Extract Depression Screening information:
              - hasBipolarDisorder: Extract "yes" or "no" if patient has pre-existing bipolar disorder diagnosis
              - screeningPerformed: Extract "yes" if PHQ-2 questions were asked, "no" if screening was not performed
              - screeningQuestion1: Extract response to "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?"
                * Map responses to: "not-at-all" (for "not at all", "none", "never"), "several-days" (for "several days", "a few days", "some days"), "more-than-half" (for "more than half the days", "most days"), "nearly-every-day" (for "nearly every day", "almost every day", "every day")
                * Example: "Not at all, really" → "not-at-all"
                * Example: "Maybe several days" → "several-days"
              - screeningQuestion2: Extract response to "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?"
                * Use same mapping as screeningQuestion1
                * Example: "Maybe several days, but not too bad" → "several-days"
              - screeningResults: Extract "positive" or "negative" based on screening results mentioned
              - screeningToolDescription: Extract tool used (e.g., "PHQ-2") or reason for ineligibility
              - followUpPlan: Extract array of follow-up actions mentioned (e.g., ["suicide risk assessment", "referral", "pharmacological interventions"])"""
        },
        "social-drivers": {
            "schema": {
                "is18OrGreater": "true|false|null",
                "notDocumented": "true|false|null",
                "screeningPerformed": "yes|no|null",
                "foodInsecurity1": "yes|no|null",
                "foodInsecurity2": "yes|no|null",
                "housing": "stable|unstable|homeless|null",
                "transportation": "yes|no|null",
                "utilities": "yes|no|null",
                "safety": "never|rarely|sometimes|often|null",
                "screeningToolUsed": "string or null",
                "results": "positive|negative|null",
                "comments": "string or null"
            },
            "instructions": """Extract Social Drivers of Health screening information:
              - is18OrGreater: Extract true if patient is 18 years or older (e.g., "Yes, I'm 45" → true)
              - notDocumented: Extract true if screening was not documented due to patient refusal or other reason
              - screeningPerformed: Extract "yes" if screening questions were asked, "no" if not performed
              - foodInsecurity1: Extract "yes" or "no" for "Within the past 12 months, are you worried that your food would run out before you got money to buy more?"
                * Example: "No, not really" → "no"
              - foodInsecurity2: Extract "yes" or "no" for "Within the past 12 months, the food you bought just didn't last and you didn't have money to get more"
                * Example: "No, I haven't had that problem" → "no"
              - housing: Extract "stable", "unstable", or "homeless" based on living situation
                * "Yes, I have stable housing" or "I own my own home" → "stable"
                * "No" or mentions of unstable/temporary housing → "unstable"
                * Mentions of homelessness → "homeless"
              - transportation: Extract "yes" or "no" for "In the past 12 months, has lack of transportation kept you from medical appointments, meetings, work, or from getting things needed for daily living?"
                * Example: "No, I have a car and I can get around just fine" → "no"
              - utilities: Extract "yes" or "no" for "In the past 12 months, has the electric, gas, oil, or water company threatened to shut off services in your home?"
                * "Never" or "No, never" → "no"
              - safety: Extract "never", "rarely", "sometimes", or "often" for "How often does anyone, including family and friends, physically hurt you?"
                * "Never", "Zero", "I've never experienced" → "never"
                * "Rarely" or "Once in a while" → "rarely"
                * "Sometimes" or "Occasionally" → "sometimes"
                * "Often" or "Frequently" → "often"
              - screeningToolUsed: Extract tool name if mentioned (e.g., "PRAPARE", "Health Leads")
              - results: Extract "positive" or "negative" based on screening results
              - comments: Extract any additional comments about social drivers"""
        },
        "elder-maltreatment": {
            "schema": {
                "screeningPerformed": "yes|no|null",
                "abuseQuestion1": "yes|no|null",
                "abuseQuestion2": "yes|no|null",
                "abuseQuestion3": "yes|no|null",
                "abuseQuestion4": "yes|no|null",
                "abuseQuestion5": "yes|no|null",
                "screeningResults": "positive|negative|null",
                "toolDescription": "string or null",
                "followUpPlanDocumented": "yes|no|null"
            },
            "instructions": """Extract Elder Maltreatment screening information:
              - screeningPerformed: Extract "yes" if screening questions were asked, "no" if not performed
              - abuseQuestion1: Extract "yes" or "no" for "Has anyone close to you called you names or put you down?"
                * Example: "No" or "No, not at all" → "no"
              - abuseQuestion2: Extract "yes" or "no" for "Has anyone forced you to do things you didn't want to do?"
                * Example: "No" → "no"
              - abuseQuestion3: Extract "yes" or "no" for "Has anyone taken things that belong to you without your consent?" or "without your OK?"
                * Example: "No" or "No, never" → "no"
              - abuseQuestion4: Extract "yes" or "no" for "Has anyone hit, slapped, kicked, or pushed you?"
                * Example: "No" or "No. Never" → "no"
              - abuseQuestion5: Extract "yes" or "no" for "Has anyone prevented you from getting food, clothes, medication, glasses, hearing aids, or medical care, or from being with people you wanted to be with?"
                * Example: "No" or "No. Nothing like that" → "no"
              - screeningResults: Extract "positive" if any abuse question is "yes", "negative" if all are "no"
                * If all questions answered "no" → "negative"
              - toolDescription: Extract screening tool name if mentioned (e.g., "Elder Abuse Suspicion Index")
              - followUpPlanDocumented: Extract "yes" or "no" if follow-up plan documentation is mentioned"""
        },
        "falls": {
            "schema": {
                "hasFallsHistory": "yes|no|null",
                "fallDetails": "string or null"
            },
            "instructions": "Extract Falls screening information."
        },
        "bmi": {
            "schema": {
                "height": "string or null",
                "weight": "string or null",
                "bmi": "number or null"
            },
            "instructions": "Extract BMI information (height, weight, calculated BMI)."
        },
        "urinary-incontinence": {
            "schema": {
                "screeningPerformed": "yes|no|null",
                "incontinenceQuestion1": "yes|no|null",
                "incontinenceQuestion2": "yes|no|null",
                "incontinenceQuestion3": "string or null",
                "incontinenceQuestion4": "string or null",
                "screeningResults": "positive|negative|null",
                "assessmentNotes": "string or null"
            },
            "instructions": """Extract Urinary Incontinence screening information:
              - screeningPerformed: Extract "yes" if screening questions were asked, "no" if not performed
              - incontinenceQuestion1: Extract "yes" or "no" for "Do you ever leak urine when you cough, sneeze, laugh, or exercise?"
                * Example: "No, I don't have that problem" → "no"
              - incontinenceQuestion2: Extract "yes" or "no" for "Do you have a strong, sudden urge to urinate that is difficult to control?"
                * Example: "No, not really" → "no"
              - incontinenceQuestion3: Extract response to "How many times do you urinate during the day?"
                * Extract the frequency mentioned (e.g., "6 or 7 times", "6-7", "about 6 or 7 times during the day" → "6 or 7" or "6-7")
                * Keep it concise but preserve the actual number mentioned
              - incontinenceQuestion4: Extract response to "How many times do you get up at night to urinate?"
                * Extract the frequency mentioned (e.g., "Usually just once, maybe twice" → "1-2" or "once, maybe twice")
                * If conditional mentioned (e.g., "maybe twice if I drank a lot of water"), include it: "1-2 times"
              - screeningResults: Extract "positive" if any incontinence symptoms are present (leakage or urge is "yes"), "negative" if both are "no"
                * If both questions are "no" → "negative"
              - assessmentNotes: Extract any additional assessment notes or comments about urinary incontinence"""
        },
        "dementia": {
            "schema": {
                "assessmentPerformed": "yes|no|null",
                "memoryQuestion1": "yes|no|null",
                "memoryQuestion2": "yes|no|null",
                "orientationQuestion1": "string or null",
                "orientationQuestion2": "string or null",
                "functionQuestion": "yes|no|null",
                "assessmentResults": "positive|negative|null",
                "supportPlan": "string or null",
                "notes": "string or null"
            },
            "instructions": """Extract Dementia Assessment information:
              - assessmentPerformed: Extract "yes" if assessment questions were asked, "no" if not performed
              - memoryQuestion1: Extract "yes" or "no" for "Do you have trouble remembering things, like appointments or recent events?"
                * Example: "No, my memory is pretty good" → "no"
              - memoryQuestion2: Extract "yes" or "no" for "Do you have difficulty finding the right words when speaking?"
                * Example: "No, I don't think so" → "no"
              - orientationQuestion1: Extract response to "What is today's date?"
                * Extract the date mentioned (e.g., "It's January 6th, 2026" → "January 6th, 2026" or "January 6, 2026")
              - orientationQuestion2: Extract response to "Where are we right now?"
                * Extract the location mentioned (e.g., "We're at the physical therapy clinic" → "physical therapy clinic")
              - functionQuestion: Extract "yes" or "no" for "Have you noticed any changes in your ability to manage daily tasks like cooking, managing finances, or taking medications?"
                * Example: "No, I can still do a lot of those things without any problems" → "no"
              - assessmentResults: Extract "positive" if any cognitive issues are present (any question is "yes"), "negative" if all are "no"
                * If all questions answered "no" → "negative"
              - supportPlan: Extract any support plan mentioned for dementia care
              - notes: Extract any additional notes about the dementia assessment"""
        },
        "diabetes": {
            "schema": {
                "hasDiabetes": "yes|no|null",
                "diabetesType": "string or null",
                "medications": "string or null",
                "complications": "string or null"
            },
            "instructions": "Extract Diabetes information."
        },
        "pain-history": {
            "schema": {
                "painAreas": [{"area": "string", "current": "string", "best": "string", "worst": "string"}] or null,
                "painDescriptions": [{"area": "string", "activityTime": "string", "symptoms": "string", "description": "string"}] or null,
                "comments": "string or null"
            },
            "instructions": """Extract Pain History. You MUST create COMPLETE entries with ALL fields populated.

EXAMPLE TRANSCRIPT (Q&A format):
"Where is the pain located? In my lower back. On a scale of 1 to 10. What's your current pain level? Right now it's probably a 6 out of 10. And what's the best your pain has been? The best was maybe a 3 or 4. Let's call it a 4. Usually in the morning after I've rested. And what's the worst your pain has been? The worst was probably an 8. That was right after I first injured it. What activities or times make the pain worse? Yeah, so for sitting for too long definitely makes it worse. And bending over. Also lifting anything heavy. How would you describe the pain? Is it aching, dull, sharp, burning, stabbing or something else? It's mostly a sharp stabbing pain in my lower back. And when it goes down my leg it feels more like a burning or tingling sensation."

REQUIRED OUTPUT for above transcript:
{
  "painAreas": [
    {
      "area": "Lumbar Spine",
      "current": "6",
      "best": "4 (morning)",
      "worst": "8"
    }
  ],
  "painDescriptions": [
    {
      "area": "Lumbar Spine",
      "activityTime": "",
      "symptoms": "sharp stabbing pain in my lower back",
      "description": "sharp, stabbing"
    },
    {
      "area": "leg",
      "activityTime": "",
      "symptoms": "when it goes down my leg it feels more like a burning or tingling sensation",
      "description": "Radiates, burning, tingling"
    },
    {
      "area": "Lumbar Spine",
      "activityTime": "sitting for too long, bending over, lifting anything heavy",
      "symptoms": "",
      "description": "Worse"
    }
  ],
  "comments": null
}

EXTRACTION RULES - FOLLOW EXACTLY:

STEP 1 - painAreas (MUST create exactly ONE entry):
  * area: Extract from "In my [location]" or "pain in my [location]". MUST use dropdown value: "lower back"/"back" → "Lumbar Spine", "upper back" → "Thoracic Spine", or exact match from: "Chest", "Thoracic Spine", "Lumbar Spine", "Knee", "Shoulder", "Hip", "Ankle", "Elbow", "Wrist", "Neck"
  * current: Extract number from "X out of 10" or "current pain level" → extract ONLY the number (e.g., "6")
  * best: Extract number from "best your pain has been" → include context if mentioned (e.g., "4 (morning)")
  * worst: Extract number from "worst your pain has been" → extract ONLY the number (e.g., "8")

STEP 2 - painDescriptions (MUST create MULTIPLE entries - minimum 2, up to 4):

  Entry 1 - Pain characteristics (ALWAYS REQUIRED):
    * area: Use same location as painAreas (e.g., "Lumbar Spine")
    * activityTime: ALWAYS use empty string ""
    * symptoms: Extract the FULL pain description phrase from "How would you describe the pain?" answer. Example: "sharp stabbing pain in my lower back" → "sharp stabbing pain in my lower back"
    * description: Extract pain descriptors (comma-separated). Example: "sharp stabbing pain" → "sharp, stabbing"

  Entry 2 - Radiation (REQUIRED if radiation mentioned):
    * area: Extract where pain radiates from "goes down my [location]" → use "leg", "arm", etc. (or dropdown value if available)
    * activityTime: ALWAYS use empty string ""
    * symptoms: Extract the FULL radiation description. Example: "when it goes down my leg it feels more like a burning or tingling sensation" → "when it goes down my leg it feels more like a burning or tingling sensation"
    * description: Use "Radiates" + descriptors. Example: "burning or tingling sensation" → "Radiates, burning, tingling"

  Entry 3 - Activities that worsen (REQUIRED if activities worsen mentioned):
    * area: Use same location as Entry 1 (e.g., "Lumbar Spine")
    * activityTime: Extract ALL activities from "What activities or times make the pain worse?" answer. Combine with commas. Example: "sitting for too long definitely makes it worse. And bending over. Also lifting anything heavy" → "sitting for too long, bending over, lifting anything heavy"
    * symptoms: ALWAYS use empty string ""
    * description: ALWAYS use "Worse"

  Entry 4 - Activities that help (REQUIRED if activities help mentioned):
    * area: Use same location as Entry 1 (e.g., "Lumbar Spine")
    * activityTime: Extract ALL activities from "What activities make the pain better?" answer. Combine with commas.
    * symptoms: ALWAYS use empty string ""
    * description: ALWAYS use "Better"

VALIDATION CHECKLIST - Your output MUST pass ALL:
  ✓ painAreas has exactly 1 entry with all 4 fields populated
  ✓ painDescriptions has Entry 1 (pain characteristics) with all 4 fields populated
  ✓ If radiation mentioned, painDescriptions has Entry 2 with all 4 fields populated
  ✓ If activities worsen mentioned, painDescriptions has Entry 3 with all 4 fields populated
  ✓ If activities help mentioned, painDescriptions has Entry 4 with all 4 fields populated
  ✓ NO field is null - use empty string "" if no value
  ✓ NO field shows "Select..." - extract actual values

CRITICAL: Partial extraction is NOT acceptable. Every entry MUST have ALL 4 fields populated with actual values or empty strings."""
        },
        "functional-status": {
            "schema": {
                "activities": [{"activity": "string", "difficulty": "string", "assistance": "string"}] or null,
                "restrictions": "string or null",
                "lastDateWorked": "string or null",
                "comments": "string or null"
            },
            "instructions": """Extract Functional Status information:
              - activities: Extract ALL activities that are difficult or require assistance
                * activity: Extract the specific activity mentioned (e.g., "putting on my socks and shoes", "lifting anything heavy", "picking things up off the floor")
                * difficulty: Extract difficulty level or description (e.g., "having trouble", "can't really bend down", "out of the question", "difficult")
                * assistance: Extract assistance needed or who provides it (e.g., "my wife has been helping me", "needs assistance", "independent")
              - restrictions: Extract work restrictions or limitations (e.g., "I can't do any heavy lifting and I have to take breaks to stand up and walk around", "light duty at work")
              - lastDateWorked: Extract when patient last worked (e.g., "I worked yesterday" → "yesterday", "I worked yesterday but just doing paperwork and supervising" → "yesterday")
              - comments: Extract any additional functional status information"""
        },
        "medical-history": {
            "schema": {
                "surgeryHistory": [{"date": "string", "type": "string", "outcome": "string"}] or null,
                "medicalConditions": [{"condition": "string", "system": "string"}] or null,
                "medications": [{"name": "string", "dosage": "string", "frequency": "string", "routeOfAdministration": "string"}] or null
            },
            "instructions": """Extract Medical History including ALL past surgeries, conditions, and medications, even if unrelated to current condition.

CRITICAL EXTRACTION RULES:
- surgeryHistory: Extract ALL surgeries mentioned, even if patient says "for a different issue" or "unrelated". Extract date (e.g., "2020", "10 years ago"), type (e.g., "knee surgery", "knee replacement"), and outcome if mentioned (e.g., "healed", "completed", "for different issue"). Example: "knee surgery in 2020" → {"date": "2020", "type": "knee surgery", "outcome": null}

- medicalConditions: Extract ALL medical conditions mentioned, including past conditions that are healed. Extract condition name (e.g., "high blood pressure", "hypertension", "broken wrist") and system/body system if identifiable (e.g., "cardiovascular", "musculoskeletal", "orthopedic"). If system is unclear, use "general" or the condition name. Example: "high blood pressure" → {"condition": "high blood pressure", "system": "cardiovascular"}

- medications: Extract ALL medications including prescription, over-the-counter, and supplements. Extract name (e.g., "Lisinopril", "Ibuprofen", "multivitamin"), dosage if mentioned (e.g., "10mg", "400mg"), frequency if mentioned (e.g., "once a day", "daily", "2 or 3 times a day", "as needed"), and route if mentioned (e.g., "oral", "by mouth", "injection"). For common medications (pills, tablets, capsules) not explicitly stating route, default to "oral". If route is truly unknown, use null. Examples:
  * "Lisinopril 10mg once a day" → {"name": "Lisinopril", "dosage": "10mg", "frequency": "once a day", "routeOfAdministration": "oral"}
  * "Ibuprofen 400mg, maybe 2 or 3 times a day" → {"name": "Ibuprofen", "dosage": "400mg", "frequency": "2 or 3 times a day", "routeOfAdministration": "oral"}
  * "muscle relaxers (unknown name)" → {"name": "muscle relaxers", "dosage": null, "frequency": null, "routeOfAdministration": "oral"}
  * "multivitamin every morning" → {"name": "multivitamin", "dosage": null, "frequency": "every morning", "routeOfAdministration": "oral"}

Extract ALL information even if partially specified. Use null for missing fields."""
        },
        "observation": {
            "schema": {
                "observation": "string or null"
            },
            "instructions": """Extract Observation information:
              - observation: Extract ALL observations including posture, gait patterns, palpation findings, and any other general observations about the patient's presentation, movement patterns, or physical findings. Combine all observation details into a single comprehensive text field."""
        },
        "arom": {
            "schema": {
                "arom": [{"motion": "string", "right": "string", "left": "string", "units": "string", "rightGrossStrength": "string or null", "leftGrossStrength": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Active Range of Motion (AROM) measurements only.

⚠️ CRITICAL RULE #1: The "motion" field is MANDATORY and CANNOT be empty, null, or undefined. Every single entry MUST have a valid motion name. If you fail to extract the motion name, your output is invalid.
⚠️ CRITICAL RULE #2: For every measurement you extract, you MUST identify what motion was tested (e.g., "Lumbar Flexion", "Hip Flexion", "Lumbar Extension") and put it in the "motion" field. This field is more important than the numeric values.
⚠️ CRITICAL RULE #3: If the transcript says "lumbar flexion" or "bend forward" (in back context), the motion field MUST be "Lumbar Flexion". If it says "hip flexion" or "lift leg", the motion field MUST be "Hip Flexion". Never leave motion empty.

STEP-BY-STEP EXTRACTION PROCESS:

For EACH measurement mentioned in the transcript:
1. FIRST: Identify and extract the MOTION NAME (this is REQUIRED, cannot be skipped)
2. THEN: Extract the numeric values (right, left)
3. THEN: Extract any pain/limitation comments
4. THEN: Extract units (default to "degrees" for ROM)

EXAMPLE TRANSCRIPT WITH PAIN:
"Let's start with active range of motion. Can you bend forward as far as you can? Okay, I'm assuming that as about 45 degrees of lumbar flexion, and you stop because of pain in your lower back. Is that right? Yes, it hurts right there. Now let's check extension. Can you bend backward? About 10 degrees of extension. And can you bend to each side? Right side bending is about 20 degrees. Left side is about 30 degrees. Now let's check your hip range of motion. Can you lift your right leg up toward your chest? Right hip flexion is about 90 degrees with pain. Left side? Left hip flexion is about 110 degrees."

REQUIRED OUTPUT (5 entries with motion names and comments):
{
  "arom": [
    {"motion": "Lumbar Flexion", "right": "45", "left": "", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": "stopped because of pain in lower back, hurts right there"},
    {"motion": "Lumbar Extension", "right": "10", "left": "", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": null},
    {"motion": "Lumbar Side Bending", "right": "20", "left": "30", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": null},
    {"motion": "Hip Flexion", "right": "90", "left": "", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": "with pain"},
    {"motion": "Hip Flexion", "right": "", "left": "110", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": null}
  ]
}

NOTE: Row 1 has comments because the transcript says "you stop because of pain in your lower back" and "it hurts right there" in the context of lumbar flexion measurement.
NOTE: Row 4 has comments because the transcript explicitly says "with pain" after mentioning "90 degrees".

MANDATORY MOTION NAME MAPPING - USE THESE EXACT NAMES:

When you see these phrases, extract these EXACT motion names:
- "bend forward" + "lumbar flexion" → "Lumbar Flexion"
- "bend forward" (in back/spine context) → "Lumbar Flexion"
- "flexion" (mentioned with "lumbar" or in back context) → "Lumbar Flexion"
- "bend backward" + "extension" (in back context) → "Lumbar Extension"
- "extension" (in back context after flexion mentioned) → "Lumbar Extension"
- "bend to the side" / "side bending" / "right side bending" / "left side bending" (in back context) → "Lumbar Side Bending"
- "rotation" / "twist" (in back context) → "Lumbar Rotation"
- "lift leg" / "lift your leg" / "hip flexion" / "leg up" → "Hip Flexion"
- "hip extension" → "Hip Extension"
- "shoulder flexion" / "lift arm forward" → "Shoulder Flexion"
- "shoulder abduction" / "lift arm to the side" → "Shoulder Abduction"
- "knee flexion" / "bend knee" → "Knee Flexion"
- "knee extension" / "straighten knee" → "Knee Extension"
- "neck flexion" / "cervical flexion" / "bend neck forward" → "Cervical Flexion"
- "neck extension" / "cervical extension" / "bend neck backward" → "Cervical Extension"
- "neck rotation" / "cervical rotation" / "turn head" → "Cervical Rotation"

CONTEXT RULES for motion naming:
- If motion type is mentioned but joint/region is NOT specified:
  * If previous motions were lumbar → default to "Lumbar [Motion]"
  * If previous motions were cervical/neck → default to "Cervical [Motion]"
  * If mentioned with "hip" or leg movement → use "Hip [Motion]"
  * If mentioned with "shoulder" or arm movement → use "Shoulder [Motion]"
  * If mentioned with "knee" → use "Knee [Motion]"

FIELD EXTRACTION RULES:

1. motion (REQUIRED - CANNOT BE EMPTY OR NULL):
   - THIS IS THE MOST IMPORTANT FIELD - IT MUST ALWAYS HAVE A VALUE
   - MUST use the exact mapping names above (e.g., "Lumbar Flexion", "Hip Flexion", "Lumbar Extension")
   - MUST include joint/region name (e.g., "Lumbar Flexion" not just "Flexion")
   - If you see "lumbar flexion" in transcript → motion MUST be "Lumbar Flexion"
   - If you see "hip flexion" in transcript → motion MUST be "Hip Flexion"
   - If you see "extension" in back context → motion MUST be "Lumbar Extension"
   - If you see "side bending" → motion MUST be "Lumbar Side Bending"
   - NEVER leave this field empty, null, or undefined - always infer from context if needed

2. right: Extract numeric value as string (numbers only, no units). 
   - If only one value given without side specified, check context for side
   - If "right [motion]" or "right side" mentioned, put value in right field

3. left: Extract numeric value as string.
   - If "left [motion]" or "left side" mentioned, extract to left field
   - If transcript says "right side is X, left side is Y", you can:
     * Create ONE entry with both right and left populated, OR
     * Create TWO separate entries (prefer this for clarity)

4. units: Always "degrees" for ROM measurements (default if not specified)

5. rightGrossStrength/leftGrossStrength: Extract if mentioned (e.g., "4/5", "5/5", "grade 4"). Use null if not mentioned.

6. comments (CRITICAL - MUST extract pain and limitations):
   ⚠️ THIS FIELD IS AS IMPORTANT AS THE NUMERIC VALUES
   - You MUST check EVERY measurement for pain or limitation mentions
   - Extract ANY mention of: "pain", "hurts", "limited by", "stopped because", "with pain", "painful", "it hurts"
   - Examples from actual transcript:
     * "and you stop because of pain in your lower back. Is that right? Yes, it hurts right there" 
       → comments: "stopped because of pain in lower back, hurts right there"
     * "Right hip flexion is about 90 degrees with pain"
       → comments: "with pain"
     * "About 45 degrees of lumbar flexion, and you stop because of pain"
       → comments: "stopped because of pain"
   - STEP-BY-STEP for comments:
     1. Read the sentence/context around each measurement
     2. Look for ANY pain-related words in that context
     3. If found, extract the FULL pain description (e.g., "stopped because of pain in lower back")
     4. If multiple pain mentions, combine them (e.g., "stopped because of pain, hurts right there")
     5. If NO pain mentioned in that measurement's context, use null
   - Common phrases to extract:
     * "stop because of pain" / "stopped because of pain" → extract the full phrase
     * "hurts" / "it hurts" / "hurts right there" → extract the full phrase
     * "with pain" → "with pain"
     * "limited by pain" → "limited by pain"
   - NEVER skip this field - if pain is mentioned near a measurement, it MUST be in comments

❌ INVALID OUTPUT EXAMPLES (DO NOT DO THIS):
{
  "arom": [
    {"motion": "", "right": "45", ...}  ← WRONG: motion is empty
    {"motion": null, "right": "45", ...}  ← WRONG: motion is null
    {"motion": undefined, "right": "45", ...}  ← WRONG: motion is undefined
  ]
}

✓ VALID OUTPUT EXAMPLES:
{
  "arom": [
    {"motion": "Lumbar Flexion", "right": "45", "left": "", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": "stopped because of pain in lower back"}  ← CORRECT: motion has value AND comments extracted
    {"motion": "Hip Flexion", "right": "90", "left": "", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": "with pain"}  ← CORRECT: motion has value AND comments extracted
    {"motion": "Lumbar Extension", "right": "10", "left": "", "units": "degrees", "rightGrossStrength": null, "leftGrossStrength": null, "comments": null}  ← CORRECT: comments is null because no pain mentioned
  ]
}

VALIDATION CHECKLIST - Your output MUST pass ALL:
✓ Every entry has a "motion" field with a valid motion name (NOT empty, NOT null, NOT undefined)
✓ Motion names match the exact mapping names above (e.g., "Lumbar Flexion", "Hip Flexion")
✓ All numeric values extracted (right, left)
✓ Pain/limitation comments extracted when mentioned - CHECK EVERY MEASUREMENT FOR PAIN MENTIONS
✓ If transcript mentions pain near a measurement, comments field MUST contain that pain information
✓ Comments field should contain full phrases like "stopped because of pain in lower back" not just "pain"
✓ Units set to "degrees" for ROM
✓ Use null (not empty string "") for missing optional fields
✓ Create separate entries for each measurement
✓ ALL measurements extracted - no missing entries
✓ Before returning your output, verify every entry has a non-empty motion field
✓ Before returning your output, verify you checked EVERY measurement for pain/limitation comments"""
        },
        "prom": {
            "schema": {
                "prom": [{"motion": "string", "right": "string", "left": "string", "units": "string", "rightGrossStrength": "string or null", "leftGrossStrength": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Passive Range of Motion (PROM) measurements only.

Same structure and extraction rules as AROM, but extract only measurements explicitly identified as "passive" range of motion (where the therapist moves the patient's limb, not the patient moving it themselves).

Follow the same motion type mapping and extraction rules as AROM."""
        },
        "girth": {
            "schema": {
                "girth": [{"measurement": "string", "right": "string", "left": "string", "units": "string", "comments": "string or null"}] or null
            },
            "instructions": """Extract Girth/Circumference measurements only.

Extract ALL girth/circumference measurements mentioned. For each measurement:
- measurement: Location measured (e.g., "upper-arm", "forearm", "thigh", "calf", "mid-thigh", "upper-thigh")
- right: Right side measurement value as string (numbers only)
- left: Left side measurement value as string (numbers only)
- units: "inches" or "cm" (determine from context)
- comments: Any additional notes. Use null if no comments.

Create ONE entry for each location measured. If both right and left measured, populate both values in the same entry."""
        },
        "muscle-testing": {
            "schema": {
                "muscleTesting": [{"muscle": "string", "rightGrade": "string or null", "leftGrade": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Manual Muscle Testing results only.

Extract ALL manual muscle testing results. For each muscle tested:
- muscle: Muscle name being tested (e.g., "Biceps", "Quadriceps", "Deltoid", "Gluteus Maximus", "Hamstrings", "Hip Flexors")
- rightGrade: Muscle grade for right side (e.g., "5/5", "4/5", "3/5", "2/5", "1/5", "0/5"). Use null if not mentioned.
- leftGrade: Muscle grade for left side. Use null if not mentioned.
- comments: Any additional notes. Use null if no comments.

IMPORTANT: Create ONE entry per muscle tested. If both right and left tested, populate both grades in the same entry."""
        },
        "special-tests": {
            "schema": {
                "specialTests": [{"testName": "string", "rightResult": "string or null", "leftResult": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Special Test results only.

Extract ALL special test results. For each test performed:
- testName: Name of the test (e.g., "SLR", "Straight Leg Raise", "McMurray's", "Lachman's", "Slump Test", "Spurling's Test")
- rightResult: Test result for right side (e.g., "positive", "negative", "equivocal"). Use null if not mentioned.
- leftResult: Test result for left side. Use null if not mentioned.
- comments: Any additional notes (e.g., "positive at 60 degrees"). Use null if no comments.

Create ONE entry per test performed. If both right and left sides tested, populate both results in the same entry."""
        },
        "myotomes": {
            "schema": {
                "myotomes": [{"myotome": "string", "rightGrade": "string or null", "leftGrade": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Myotome test results only.

Extract ALL myotome test results. For each myotome tested:
- myotome: Myotome level tested (e.g., "C5", "C6", "L4", "L5", "S1")
- rightGrade: Muscle strength grade for right side if mentioned (e.g., "5/5", "4/5", "3/5", "2/5", "1/5", "0/5"). Use null if not mentioned.
- leftGrade: Muscle strength grade for left side. Use null if not mentioned.
- comments: Additional notes. Use null if no comments.

Create ONE entry per myotome level tested. If both right and left tested, populate both grades in the same entry."""
        },
        "dermatomes": {
            "schema": {
                "dermatomes": [{"dermatome": "string", "rightSensation": "string or null", "leftSensation": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Dermatome test results only.

Extract ALL dermatome test results. For each dermatome tested:
- dermatome: Dermatome level tested (e.g., "C2", "C3", "L4", "L5", "S1")
- rightSensation: Sensation findings for right side (e.g., "intact", "decreased", "absent", "altered", "normal"). Use null if not mentioned.
- leftSensation: Sensation findings for left side. Use null if not mentioned.
- comments: Additional notes. Use null if no comments.

Create ONE entry per dermatome level tested. If both right and left tested, populate both sensation findings in the same entry."""
        },
        "reflexes": {
            "schema": {
                "reflexes": [{"reflexName": "string", "rightResult": "string or null", "leftResult": "string or null", "comments": "string or null"}] or null
            },
            "instructions": """Extract Deep Tendon Reflex test results only.

Extract ALL deep tendon reflex test results. For each reflex tested:
- reflexName: Reflex tested (e.g., "biceps", "patellar", "achilles", "brachioradialis", "triceps")
- rightResult: Reflex grade/results for right side (e.g., "2+", "3+", "1+", "hypoactive", "hyperactive", "absent", "normal"). Use null if not mentioned.
- leftResult: Reflex grade/results for left side. Use null if not mentioned.
- comments: Additional notes. Use null if no comments.

Create ONE entry per reflex tested. If both right and left tested, populate both results in the same entry."""
        },
        "functional-testing": {
            "schema": {
                "functionalTesting": "string or null"
            },
            "instructions": """Extract Functional Testing information:
              - functionalTesting: Extract ALL functional assessment results including test names (LEFS, DASH, Sit-to-Stand, etc.), scores, and performance descriptions. Combine all functional testing information into a single comprehensive text field."""
        },
        "current-functional-limitations": {
            "schema": {
                "currentFunctionalLimitations": "string or null"
            },
            "instructions": """Extract Current Functional Limitations information:
              - currentFunctionalLimitations: Extract ALL current functional limitations including activities the patient is unable to do, having difficulty with, and how these limitations impact daily activities, work, or quality of life. Combine all limitation information into a single comprehensive text field."""
        }
    }
    
    if section_id not in section_schemas:
        raise ValueError(f"Unknown section ID: {section_id}")
    
    section_info = section_schemas[section_id]
    
    system_prompt = f"""You are a medical documentation assistant. Extract structured data for the "{section_id}" section from a physical therapy transcript.

{section_info['instructions']}

Return ONLY valid JSON matching this exact schema:
{json.dumps(section_info['schema'], indent=2)}

CRITICAL: Return ONLY the JSON object, no markdown code blocks, no explanations, just valid JSON. Use null for fields not mentioned."""

    user_prompt = f"""Extract data for the "{section_id}" section from this transcript:

{transcript}

Return ONLY the JSON object matching the schema above."""

    return {
        "model": DEFAULT_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "stream": False,
        "format": "json"
    }

@app.route('/extract-section', methods=['POST'])
def extract_section():
    """Extract structured data for a single section from transcript."""
    try:
        data = request.get_json()
        transcript = data.get('transcript')
        section_id = request.args.get('sectionId')
        
        if not transcript or not isinstance(transcript, str):
            return jsonify({"error": "Transcript is required"}), 400
        
        if not section_id:
            return jsonify({"error": "Section ID is required"}), 400
        
        # Get model from query parameter or use default
        model = request.args.get('model', DEFAULT_MODEL)
        
        print(f"Extracting {section_id} section using model: {model}...", file=sys.stderr, flush=True)
        print(f"Transcript length: {len(transcript)} characters", file=sys.stderr, flush=True)
        
        # Prepare prompt
        try:
            prompt_data = get_section_extraction_prompt(transcript, section_id)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        
        prompt_data['model'] = model
        
        # Call Ollama API
        ollama_url = f"{OLLAMA_BASE_URL}/api/chat"
        print(f"Calling Ollama at {ollama_url}...", file=sys.stderr, flush=True)
        
        response = requests.post(
            ollama_url,
            json=prompt_data,
            timeout=60  # 1 minute timeout for single section
        )
        
        if not response.ok:
            error_text = response.text
            print(f"Ollama API error: {error_text}", file=sys.stderr, flush=True)
            return jsonify({
                "error": f"Ollama API error: {response.status_code} - {error_text}"
            }), response.status_code
        
        result = response.json()
        content = result.get('message', {}).get('content', '')
        
        if not content:
            return jsonify({"error": "Empty response from Ollama"}), 500
        
        # Extract and parse JSON
        try:
            extracted_data = extract_json_from_response(content)
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON from Ollama response: {e}", file=sys.stderr, flush=True)
            print(f"Raw content (first 500 chars): {content[:500]}", file=sys.stderr, flush=True)
            return jsonify({
                "error": f"Failed to parse JSON from Ollama response: {str(e)}"
            }), 500
        
        print(f"Extraction complete for {section_id} section", file=sys.stderr, flush=True)
        print(json.dumps(extracted_data, indent=2), file=sys.stderr, flush=True)
        
        return jsonify({"extractedData": extracted_data})
        
    except requests.exceptions.ConnectionError:
        return jsonify({
            "error": "Cannot connect to Ollama. Make sure Ollama is running (run 'ollama serve' if needed)."
        }), 503
    except Exception as e:
        error_msg = f"Extraction error: {str(e)}"
        print(error_msg, file=sys.stderr, flush=True)
        print(traceback.format_exc(), file=sys.stderr, flush=True)
        return jsonify({"error": error_msg}), 500

if __name__ == '__main__':
    # Get port from environment or default to 8001
    port = int(os.getenv('EXTRACT_SERVER_PORT', 8001))
    
    print(f"Starting Ollama Extraction Server on port {port}...", file=sys.stderr, flush=True)
    print(f"Using Ollama at: {OLLAMA_BASE_URL}", file=sys.stderr, flush=True)
    print(f"Default model: {DEFAULT_MODEL}", file=sys.stderr, flush=True)
    print("Press Ctrl+C to stop the server", file=sys.stderr, flush=True)
    
    # Run Flask app
    app.run(host='127.0.0.1', port=port, debug=False)

