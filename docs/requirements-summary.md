# PT Software Requirements Summary

**Last Updated:** December 22, 2025  
**Source:** Meeting transcript with Liza Tan and Susan (Physical Therapists)

---

## Core Principles

1. **Workflow First, Aesthetics Second** - Focus on process efficiency over visual design
2. **Balance Patient & PT Needs** - Patients want quick intake; PTs need comprehensive data
3. **HIPAA Compliance** - All patient data handling must comply with privacy regulations
4. **White Label Solution** - Design for general PT use, specialized layers for future

---

## Intake Form Requirements

### Key Changes from Initial Design

1. **Terminology:**
   - Use "symptoms" instead of "pain" (psychological consideration)
   - "Onset date" → "Onset date (make your best guess)"

2. **Symptom Assessment:**
   - Primary symptom area selection
   - Pain intensity (0-10 scale)
   - Pain description (localized vs. radiating)
   - Aggravating factors
   - SINSS Framework:
     - **S**ymptoms
     - **I**rritability (how long before pain occurs, how long it lasts)
     - **N**ature of pain (constant, intermittent, etc.)
     - **S**everity
     - **S**tability
   - Pain behavior questions:
     - More pain in morning or evening?
     - Does pain wake you up at night?
     - Does pain get relieved with movement?
     - Constant or intermittent?

3. **Medical History:**
   - Group by body systems (respiratory, cardiovascular, neurological, etc.)
   - Common conditions: diabetes, hypertension, pacemaker, stroke
   - Previous surgeries with dates and outcomes
   - Cancer history (including treatment: chemo, radiation, immunotherapy)
   - Medications list
   - Blood thinners

4. **Screening Questions:**
   - **Red Flags (10 questions):**
     - Unexplained weight loss
     - Changes in bowel/bladder function
     - Night pain (especially constant)
     - Sweating
     - Sleep disturbances
     - Use of cortisone/steroids (affects bone density)
   - **Yellow Flags:**
     - PHQ-2 (2 questions for depression)
     - PHQ-4 (4 questions: 2 anxiety + 2 depression)
     - GADS (anxiety questionnaire)
     - Social drivers of health (11 questions)
     - Elder maltreatment screening

5. **Pre-Visit Instructions:**
   - Bring ID
   - Bring insurance card
   - Bring doctor's prescription (if available)
   - Bring list of medications
   - Wear loose-fitting clothing
   - For knee/foot issues: bring shorts

---

## Documentation Workflow Requirements

### SOAP Note Structure

1. **Subjective:**
   - Current condition
   - Pain history
   - Functional status
   - Medical history
   - Previous surgeries

2. **Objective:**
   - Vitals (BP, HR, O2 saturation)
   - Observation (posture, gait, palpation)
   - Range of Motion (AROM and PROM)
   - Muscle testing
   - Special tests
   - Neurological testing (dermatomes, myotomes, reflexes)
   - Functional testing (LEFS, DASH, sit-stand, etc.)

3. **Assessment:**
   - Problem list
   - Goals (short-term and long-term)

4. **Plan:**
   - Treatment frequency (e.g., 3x/week for first 2 weeks, then 2x/week)
   - Duration (total weeks)
   - Treatment modalities with justification
   - Exercises with billing codes

### Key Features Needed

1. **Voice Dictation/Recording:**
   - HIPAA-compliant recording with patient consent
   - On-screen transcription display
   - Visual prompts/guides for PTs
   - Mobile app for recording while hands-on with patient
   - Containerization for privacy (data doesn't stay on phone)

2. **Templates:**
   - Body part-specific templates (knee, hip, shoulder, etc.)
   - Pre-filled common phrases (double-click to insert)
   - Customizable protocols

3. **Billing Integration:**
   - Time tracking (time in/time out)
   - Modality codes (97110, 97112, 97130, etc.)
   - Unit calculation based on time
   - Insurance-specific billing requirements
   - Shortcuts/macros for common billing scenarios
   - Suggested charges with perform/not perform options

4. **Document Management:**
   - Document locking after completion
   - Addendum capability for corrections
   - Management review system (supervisor can review all PT notes)
   - Generate Word document for final report
   - Spell check and missing information alerts

---

## Workflow Pain Points to Address

1. **Time Management:**
   - PTs often complete documentation after hours
   - Difficult to type while hands-on with patient
   - Need mobile solution for recording during treatment

2. **Billing Complexity:**
   - Current systems require workarounds/shortcuts
   - Insurance-specific requirements vary
   - Time tracking must be accurate

3. **Document Accuracy:**
   - Insurance audits require perfect documentation
   - Need review system to catch errors before submission
   - Ability to edit locked documents with proper audit trail

4. **Efficiency:**
   - Too many clicks in current systems
   - Range of motion testing requires multiple windows/clicks
   - Need streamlined interface for common tasks

---

## Technical Requirements

1. **Platform:**
   - Web-based (accessible from any device)
   - Mobile-responsive for recording during treatment
   - No patient data stored on mobile devices (containerization)

2. **Privacy & Security:**
   - HIPAA compliance
   - Patient consent for recording
   - Secure data transmission
   - No local storage of patient data on mobile

3. **Integration:**
   - Calendar/scheduling system
   - Patient management
   - Billing system
   - Insurance verification

---

## Future Enhancements

1. **AI Features:**
   - Voice-to-text transcription
   - AI-assisted documentation organization
   - Specialized PT documentation AI (requires training)

2. **Specialized Modules:**
   - Lymphedema-specific measurements
   - Cancer patient protocols
   - Regional pain syndrome documentation

3. **Analytics:**
   - Patient progress tracking
   - Treatment outcome metrics
   - Billing efficiency reports

---

## Key Insights from Meeting

1. **Patient Communication:**
   - Avoid putting "pain" in patient's mind - use "symptoms"
   - Patients often can't remember exact dates - allow approximations
   - Intake form should facilitate appointment booking, not replace evaluation

2. **PT Workflow:**
   - Subjective portion can be streamlined with good intake form
   - Objective testing requires hands-on work - can't type simultaneously
   - Documentation often happens after patient leaves

3. **Billing Reality:**
   - Extremely complex system requiring shortcuts
   - Insurance requirements vary significantly
   - Accuracy is critical for reimbursement

4. **Documentation Philosophy:**
   - Templates and shortcuts are essential
   - Pre-filled common phrases save time
   - Visual guides help PTs know what to document next

---

## Next Steps

1. Build web-based demo with final UI/colors for review
2. Implement intake form with all requested changes
3. Research HIPAA compliance for voice recording
4. Design mobile recording interface
5. Create documentation templates based on Epic workflow
6. Design simplified billing workflow

---

## References

- Meeting Recording: https://fathom.video/share/CsWa9y6Jymc6HS22gUPqByumyPHsaV7K
- Full Transcript: `docs/meeting-transcript-december-22.md`

