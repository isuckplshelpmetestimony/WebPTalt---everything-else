'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface UrinaryIncontinenceScreeningData {
  screeningPerformed?: 'yes' | 'no';
  screeningResults?: 'positive' | 'negative';
  assessmentNotes?: string;
}

interface UrinaryIncontinenceScreeningProps {
  data: UrinaryIncontinenceScreeningData;
  onChange: (data: UrinaryIncontinenceScreeningData) => void;
}

export const UrinaryIncontinenceScreening: React.FC<UrinaryIncontinenceScreeningProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: keyof UrinaryIncontinenceScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const questions: ScreeningQuestion[] = [
    {
      id: 'screening-performed',
      label: 'Was this patient screened for urinary incontinence?',
      type: 'yes-no',
      value: data.screeningPerformed,
      onChange: (value) => updateField('screeningPerformed', value),
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
    />
  );
};



