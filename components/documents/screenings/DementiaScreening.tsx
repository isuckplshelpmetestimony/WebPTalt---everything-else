'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface DementiaScreeningData {
  assessmentPerformed?: 'yes' | 'no';
  memoryQuestion1?: string; // Response to memory question 1
  memoryQuestion2?: string; // Response to memory question 2
  orientationQuestion1?: string; // Response to orientation question 1
  orientationQuestion2?: string; // Response to orientation question 2
  functionQuestion?: string; // Response to function question
  assessmentResults?: 'positive' | 'negative';
  supportPlan?: string;
  notes?: string;
}

interface DementiaScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: DementiaScreeningData;
  onChange: (data: DementiaScreeningData) => void;
}

export const DementiaScreening: React.FC<DementiaScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof DementiaScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const yesNoOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];

  const questions: ScreeningQuestion[] = [
    {
      id: 'assessment-performed',
      label: 'Was this patient assessed for dementia?',
      type: 'yes-no',
      value: data.assessmentPerformed,
      onChange: (value) => updateField('assessmentPerformed', value),
    },
    {
      id: 'memory-1',
      label: 'Do you have trouble remembering things, like appointments or recent events?',
      type: 'radio',
      options: yesNoOptions,
      value: data.memoryQuestion1,
      onChange: (value) => updateField('memoryQuestion1', value),
    },
    {
      id: 'memory-2',
      label: 'Do you have difficulty finding the right words when speaking?',
      type: 'radio',
      options: yesNoOptions,
      value: data.memoryQuestion2,
      onChange: (value) => updateField('memoryQuestion2', value),
    },
    {
      id: 'orientation-1',
      label: "What is today's date?",
      type: 'text',
      value: data.orientationQuestion1,
      onChange: (value) => updateField('orientationQuestion1', value),
      placeholder: 'Patient response',
    },
    {
      id: 'orientation-2',
      label: 'Where are we right now?',
      type: 'text',
      value: data.orientationQuestion2,
      onChange: (value) => updateField('orientationQuestion2', value),
      placeholder: 'Patient response',
    },
    {
      id: 'function',
      label: 'Have you noticed any changes in your ability to manage daily tasks like cooking, managing finances, or taking medications?',
      type: 'radio',
      options: yesNoOptions,
      value: data.functionQuestion,
      onChange: (value) => updateField('functionQuestion', value),
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
      sectionId={sectionId}
      isRecording={isRecording}
      isProcessing={isProcessing}
      isMicModeEnabled={isMicModeEnabled}
      onMicClick={onMicClick}
      micModePrompts={micModePrompts}
    />
  );
};





