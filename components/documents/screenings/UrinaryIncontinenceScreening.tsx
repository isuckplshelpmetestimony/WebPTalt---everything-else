'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface UrinaryIncontinenceScreeningData {
  screeningPerformed?: 'yes' | 'no';
  incontinenceQuestion1?: string; // Response to question 1
  incontinenceQuestion2?: string; // Response to question 2
  incontinenceQuestion3?: string; // Response to question 3
  incontinenceQuestion4?: string; // Response to question 4
  screeningResults?: 'positive' | 'negative';
  assessmentNotes?: string;
}

interface UrinaryIncontinenceScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: UrinaryIncontinenceScreeningData;
  onChange: (data: UrinaryIncontinenceScreeningData) => void;
}

export const UrinaryIncontinenceScreening: React.FC<UrinaryIncontinenceScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof UrinaryIncontinenceScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const questions: ScreeningQuestion[] = [
    {
      id: 'screening-performed',
      label: 'Was this patient screened for urinary incontinence?',
      type: 'yes-no',
      value: data.screeningPerformed,
      onChange: (value) => updateField('screeningPerformed', value),
    },
    {
      id: 'incontinence-1',
      label: 'Do you ever leak urine when you cough, sneeze, laugh, or exercise?',
      type: 'radio',
      options: yesNoOptions,
      value: data.incontinenceQuestion1,
      onChange: (value) => updateField('incontinenceQuestion1', value),
    },
    {
      id: 'incontinence-2',
      label: 'Do you have a strong, sudden urge to urinate that is difficult to control?',
      type: 'radio',
      options: yesNoOptions,
      value: data.incontinenceQuestion2,
      onChange: (value) => updateField('incontinenceQuestion2', value),
    },
    {
      id: 'incontinence-3',
      label: 'How many times do you urinate during the day?',
      type: 'text',
      value: data.incontinenceQuestion3,
      onChange: (value) => updateField('incontinenceQuestion3', value),
      placeholder: 'e.g., 8-10 times',
    },
    {
      id: 'incontinence-4',
      label: 'How many times do you get up at night to urinate?',
      type: 'text',
      value: data.incontinenceQuestion4,
      onChange: (value) => updateField('incontinenceQuestion4', value),
      placeholder: 'e.g., 2-3 times',
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
      id: 'assessment-notes',
      label: 'Assessment Notes:',
      type: 'textarea',
      value: data.assessmentNotes,
      onChange: (value) => updateField('assessmentNotes', value),
    },
  ];

  return (
    <ScreeningSection
      title="Urinary Incontinence"
      questions={questions}
      sectionId={sectionId}
      isRecording={isRecording}
      isProcessing={isProcessing}
      isMicModeEnabled={isMicModeEnabled}
      onMicClick={onMicClick}
      micModePrompts={micModePrompts}
    />
  );
};





