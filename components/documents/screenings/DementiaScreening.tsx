'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface DementiaScreeningData {
  assessmentPerformed?: 'yes' | 'no';
  assessmentResults?: 'positive' | 'negative';
  supportPlan?: string;
  notes?: string;
}

interface DementiaScreeningProps {
  data: DementiaScreeningData;
  onChange: (data: DementiaScreeningData) => void;
}

export const DementiaScreening: React.FC<DementiaScreeningProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: keyof DementiaScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const questions: ScreeningQuestion[] = [
    {
      id: 'assessment-performed',
      label: 'Was this patient assessed for dementia?',
      type: 'yes-no',
      value: data.assessmentPerformed,
      onChange: (value) => updateField('assessmentPerformed', value),
    },
    {
      id: 'assessment-results',
      label: 'Assessment Results:',
      type: 'radio',
      options: [
        { value: 'positive', label: 'Positive' },
        { value: 'negative', label: 'Negative' },
      ],
      value: data.assessmentResults,
      onChange: (value) => updateField('assessmentResults', value),
    },
    {
      id: 'support-plan',
      label: 'Support Plan:',
      type: 'textarea',
      value: data.supportPlan,
      onChange: (value) => updateField('supportPlan', value),
    },
    {
      id: 'notes',
      label: 'Additional Notes:',
      type: 'textarea',
      value: data.notes,
      onChange: (value) => updateField('notes', value),
    },
  ];

  return (
    <ScreeningSection
      title="Dementia Assessment & Support"
      questions={questions}
    />
  );
};

