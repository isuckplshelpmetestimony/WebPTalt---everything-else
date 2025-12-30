'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface SocialDriversScreeningData {
  is18OrGreater?: boolean;
  notDocumented?: boolean;
  screeningPerformed?: 'yes' | 'no';
  screeningToolUsed?: string;
  results?: 'positive' | 'negative';
  comments?: string;
}

interface SocialDriversScreeningProps {
  data: SocialDriversScreeningData;
  onChange: (data: SocialDriversScreeningData) => void;
}

export const SocialDriversScreening: React.FC<SocialDriversScreeningProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: keyof SocialDriversScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const questions: ScreeningQuestion[] = [
    {
      id: 'age-check',
      label: '18 Years of Age or Greater:',
      type: 'checkbox',
      options: [{ value: 'yes', label: '18 Years of Age or Greater' }],
      value: data.is18OrGreater ? ['yes'] : [],
      onChange: (value) => updateField('is18OrGreater', Array.isArray(value) && value.includes('yes')),
    },
    {
      id: 'not-documented',
      label: 'Not Documented (Patient Refusal or Other):',
      type: 'checkbox',
      options: [{ value: 'yes', label: 'Not Documented (Patient Refusal or Other)' }],
      value: data.notDocumented ? ['yes'] : [],
      onChange: (value) => updateField('notDocumented', Array.isArray(value) && value.includes('yes')),
    },
    {
      id: 'screening-performed',
      label: 'Patient screened for food insecurity, housing instability, transportation needs, utility difficulties and interpersonal safety:',
      type: 'yes-no',
      value: data.screeningPerformed,
      onChange: (value) => updateField('screeningPerformed', value),
    },
    {
      id: 'screening-tool',
      label: 'Screening Tool Used:',
      type: 'text',
      value: data.screeningToolUsed,
      onChange: (value) => updateField('screeningToolUsed', value),
    },
    {
      id: 'results',
      label: 'Results:',
      type: 'radio',
      options: [
        { value: 'positive', label: 'Positive' },
        { value: 'negative', label: 'Negative' },
      ],
      value: data.results,
      onChange: (value) => updateField('results', value),
    },
    {
      id: 'comments',
      label: 'Comments:',
      type: 'textarea',
      value: data.comments,
      onChange: (value) => updateField('comments', value),
    },
  ];

  return (
    <ScreeningSection
      title="Social Drivers of Health"
      questions={questions}
    />
  );
};



