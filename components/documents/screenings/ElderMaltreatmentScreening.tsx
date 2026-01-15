'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface ElderMaltreatmentScreeningData {
  screeningPerformed?: 'yes' | 'no';
  abuseQuestion1?: string; // Response to abuse question 1
  abuseQuestion2?: string; // Response to abuse question 2
  abuseQuestion3?: string; // Response to abuse question 3
  abuseQuestion4?: string; // Response to abuse question 4
  abuseQuestion5?: string; // Response to abuse question 5
  screeningResults?: 'positive' | 'negative';
  toolDescription?: string;
  followUpPlanDocumented?: 'yes' | 'no';
}

interface ElderMaltreatmentScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: ElderMaltreatmentScreeningData;
  onChange: (data: ElderMaltreatmentScreeningData) => void;
}

export const ElderMaltreatmentScreening: React.FC<ElderMaltreatmentScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof ElderMaltreatmentScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const validate = (): { isValid: boolean; errorMessage?: string } => {
    if (data.screeningPerformed === 'yes' && !data.toolDescription && !data.screeningResults) {
      return {
        isValid: false,
        errorMessage: 'No documentation of an elder maltreatment screen, reason not given',
      };
    }
    return { isValid: true };
  };

  const validation = validate();

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const questions: ScreeningQuestion[] = [
    {
      id: 'screening-performed',
      label: 'Elder Maltreatment Screen Performed?',
      type: 'yes-no',
      required: true,
      value: data.screeningPerformed,
      onChange: (value) => updateField('screeningPerformed', value),
    },
    {
      id: 'abuse-1',
      label: 'Has anyone close to you called you names or put you down?',
      type: 'radio',
      options: yesNoOptions,
      value: data.abuseQuestion1,
      onChange: (value) => updateField('abuseQuestion1', value),
    },
    {
      id: 'abuse-2',
      label: "Has anyone forced you to do things you didn't want to do?",
      type: 'radio',
      options: yesNoOptions,
      value: data.abuseQuestion2,
      onChange: (value) => updateField('abuseQuestion2', value),
    },
    {
      id: 'abuse-3',
      label: 'Has anyone taken things that belong to you without your OK?',
      type: 'radio',
      options: yesNoOptions,
      value: data.abuseQuestion3,
      onChange: (value) => updateField('abuseQuestion3', value),
    },
    {
      id: 'abuse-4',
      label: 'Has anyone hit, slapped, kicked, or pushed you?',
      type: 'radio',
      options: yesNoOptions,
      value: data.abuseQuestion4,
      onChange: (value) => updateField('abuseQuestion4', value),
    },
    {
      id: 'abuse-5',
      label: 'Has anyone prevented you from getting food, clothes, medication, glasses, hearing aids, or medical care, or from being with people you wanted to be with?',
      type: 'radio',
      options: yesNoOptions,
      value: data.abuseQuestion5,
      onChange: (value) => updateField('abuseQuestion5', value),
    },
    {
      id: 'screening-results',
      label: 'Screening Results:',
      type: 'radio',
      options: [
        { value: 'positive', label: 'Positive' },
        { value: 'negative', label: 'Negative' },
      ],
      value: data.screeningResults,
      onChange: (value) => updateField('screeningResults', value),
    },
    {
      id: 'tool-description',
      label: 'Screening Tool Description or Reason for Patient Ineligibility:',
      helpText: 'Describe the screening tool used or provide reason if patient is ineligible',
      type: 'textarea',
      value: data.toolDescription,
      onChange: (value) => updateField('toolDescription', value),
    },
    {
      id: 'follow-up-plan',
      label: 'Follow-Up Plan Documented?',
      type: 'yes-no',
      value: data.followUpPlanDocumented,
      onChange: (value) => updateField('followUpPlanDocumented', value),
    },
  ];

  return (
    <ScreeningSection
      title="Elder Maltreatment"
      questions={questions}
      sectionId={sectionId}
      isRecording={isRecording}
      isProcessing={isProcessing}
      isMicModeEnabled={isMicModeEnabled}
      onMicClick={onMicClick}
      micModePrompts={micModePrompts}
      validation={validation}
    >
      {validation && !validation.isValid && (
        <div className="pt-4 border-t border-cairos-border">
          <div className="flex items-center gap-2 text-cairos-alert">
            <span className="text-body-sm font-medium">Elder Maltreatment Assessment</span>
            <span className="text-body-sm">X</span>
            <span className="text-body-sm">{validation.errorMessage}</span>
          </div>
        </div>
      )}
    </ScreeningSection>
  );
};





