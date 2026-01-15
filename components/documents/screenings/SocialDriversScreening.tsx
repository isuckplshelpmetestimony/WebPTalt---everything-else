'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface SocialDriversScreeningData {
  is18OrGreater?: boolean;
  notDocumented?: boolean;
  screeningPerformed?: 'yes' | 'no';
  foodInsecurity1?: string; // Response to food insecurity question 1
  foodInsecurity2?: string; // Response to food insecurity question 2
  housing?: string; // Response to housing question
  transportation?: string; // Response to transportation question
  utilities?: string; // Response to utilities question
  safety?: string; // Response to safety question
  screeningToolUsed?: string;
  results?: 'positive' | 'negative';
  comments?: string;
}

interface SocialDriversScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: SocialDriversScreeningData;
  onChange: (data: SocialDriversScreeningData) => void;
}

export const SocialDriversScreening: React.FC<SocialDriversScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof SocialDriversScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

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
      id: 'food-insecurity-1',
      label: 'Within the past 12 months, you worried that your food would run out before you got money to buy more. Is that true for you?',
      type: 'radio',
      options: yesNoOptions,
      value: data.foodInsecurity1,
      onChange: (value) => updateField('foodInsecurity1', value),
    },
    {
      id: 'food-insecurity-2',
      label: "Within the past 12 months, the food you bought just didn't last and you didn't have money to get more. Is that true for you?",
      type: 'radio',
      options: yesNoOptions,
      value: data.foodInsecurity2,
      onChange: (value) => updateField('foodInsecurity2', value),
    },
    {
      id: 'housing',
      label: 'What is your living situation today? Do you have stable housing?',
      type: 'radio',
      options: [
        { value: 'stable', label: 'Stable housing' },
        { value: 'unstable', label: 'Unstable housing' },
        { value: 'homeless', label: 'Homeless' },
      ],
      value: data.housing,
      onChange: (value) => updateField('housing', value),
    },
    {
      id: 'transportation',
      label: 'In the past 12 months, has lack of transportation kept you from medical appointments, meetings, work, or from getting things needed for daily living?',
      type: 'radio',
      options: yesNoOptions,
      value: data.transportation,
      onChange: (value) => updateField('transportation', value),
    },
    {
      id: 'utilities',
      label: 'In the past 12 months, has the electric, gas, oil, or water company threatened to shut off services in your home?',
      type: 'radio',
      options: yesNoOptions,
      value: data.utilities,
      onChange: (value) => updateField('utilities', value),
    },
    {
      id: 'safety',
      label: 'How often does anyone, including family and friends, physically hurt you?',
      type: 'radio',
      options: [
        { value: 'never', label: 'Never' },
        { value: 'rarely', label: 'Rarely' },
        { value: 'sometimes', label: 'Sometimes' },
        { value: 'often', label: 'Often' },
      ],
      value: data.safety,
      onChange: (value) => updateField('safety', value),
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
      sectionId={sectionId}
      isRecording={isRecording}
      isProcessing={isProcessing}
      isMicModeEnabled={isMicModeEnabled}
      onMicClick={onMicClick}
      micModePrompts={micModePrompts}
    />
  );
};





