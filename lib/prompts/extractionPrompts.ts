/**
 * Extraction prompts for Z.ai GLM-4.5 to extract structured data from transcripts
 */

import { subjectivePrompts } from './subjectivePrompts';

export interface ExtractionPrompt {
  systemPrompt: string;
  userPrompt: (transcript: string) => string;
  expectedSchema: object;
}

/**
 * Create extraction prompt for all sections from a single transcript
 */
export function createMultiSectionExtractionPrompt(transcript: string): ExtractionPrompt {
  const systemPrompt = `You are a medical documentation assistant. Your task is to extract structured data from a physical therapy initial evaluation transcript.

The transcript contains a conversation between a therapist and patient covering multiple subjective assessment sections. You need to identify which parts of the transcript relate to each section and extract the relevant information.

Extract data for ALL of the following sections:
1. Current Condition (chief complaint, onset date, type of injury, specific injury, surgery info, occupation, treatments)
2. Depression Screening (bipolar disorder, screening performed, results, tool used, follow-up plan)
3. Social Drivers of Health (age check, screening performed, tool used, results, comments)
4. Elder Maltreatment (screening performed, tool used, results, comments)
5. Falls (falls history, fall details)
6. BMI (height, weight, calculated BMI)
7. Urinary Incontinence (screening performed, tool used, results, comments)
8. Dementia Assessment (assessment performed, tool used, results)
9. Diabetes (has diabetes, type, medications, complications)
10. Pain History (pain areas with current/best/worst ratings, pain descriptions with activity/time, symptoms, description, comments)
11. Functional Status (activities with difficulty/assistance, restrictions, last date worked, comments)
12. Medical History (surgery history with date/type/outcome, medical conditions with system, medications with name/dosage/frequency/route)

Return ONLY valid JSON matching this exact schema:
{
  "current-condition": {
    "chiefComplaint": "string or null",
    "onsetDate": "string or null",
    "typeOfInjury": "string or null",
    "specificInjury": "string or null",
    "surgeryDate": "string or null",
    "surgeryType": "string or null",
    "occupation": "string or null",
    "treatmentsRelated": ["string"] or null
  },
  "depression": {
    "hasBipolarDisorder": "yes|no|null",
    "screeningPerformed": "yes|no|null",
    "screeningResults": "positive|negative|null",
    "screeningToolDescription": "string or null",
    "followUpPlan": ["string"] or null
  },
  "social-drivers": {
    "is18OrGreater": true|false|null,
    "notDocumented": true|false|null,
    "screeningPerformed": "yes|no|null",
    "screeningToolUsed": "string or null",
    "results": "positive|negative|null",
    "comments": "string or null"
  },
  "elder-maltreatment": {
    "screeningPerformed": "yes|no|null",
    "screeningToolUsed": "string or null",
    "results": "positive|negative|null",
    "comments": "string or null"
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
    "screeningToolUsed": "string or null",
    "results": "positive|negative|null",
    "comments": "string or null"
  },
  "dementia": {
    "assessmentPerformed": "yes|no|null",
    "assessmentTool": "string or null",
    "assessmentResults": "string or null"
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

Important:
- If information is not mentioned in the transcript, use null for that field
- Extract dates in natural format (e.g., "3 weeks ago", "January 2024", "2024-01-15")
- For pain ratings, extract numbers (e.g., "7 out of 10" → "7/10")
- For yes/no questions, extract "yes" or "no" only
- Be precise and only extract information that is explicitly stated
- Return valid JSON only, no additional text`;

  const userPrompt = (transcript: string) => `Extract all relevant information from this physical therapy initial evaluation transcript:

${transcript}

Return the extracted data as JSON matching the schema above.`;

  const expectedSchema = {
    type: 'object',
    properties: {
      'current-condition': { type: 'object' },
      'depression': { type: 'object' },
      'social-drivers': { type: 'object' },
      'elder-maltreatment': { type: 'object' },
      'falls': { type: 'object' },
      'bmi': { type: 'object' },
      'urinary-incontinence': { type: 'object' },
      'dementia': { type: 'object' },
      'diabetes': { type: 'object' },
      'pain-history': { type: 'object' },
      'functional-status': { type: 'object' },
      'medical-history': { type: 'object' },
    },
  };

  return {
    systemPrompt,
    userPrompt: (t: string) => userPrompt(t),
    expectedSchema,
  };
}



