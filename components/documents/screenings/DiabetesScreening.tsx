'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface DiabetesScreeningData {
  hasDiabetes?: 'yes' | 'no';
  diabetesType?: 'type1' | 'type2' | 'gestational' | 'prediabetes';
  currentStatus?: 'controlled' | 'uncontrolled' | 'under-md-care';
  onset?: string;
  medications?: string;
  notes?: string;
}

interface DiabetesScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: DiabetesScreeningData;
  onChange: (data: DiabetesScreeningData) => void;
}

export const DiabetesScreening: React.FC<DiabetesScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof DiabetesScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const questions: ScreeningQuestion[] = [
    {
      id: 'has-diabetes',
      label: 'Does the patient have diabetes?',
      type: 'yes-no',
      value: data.hasDiabetes,
      onChange: (value) => updateField('hasDiabetes', value),
    },
    {
      id: 'diabetes-type',
      label: 'Diabetes Type:',
      type: 'radio',
      options: [
        { value: 'type1', label: 'Type 1' },
        { value: 'type2', label: 'Type 2' },
        { value: 'gestational', label: 'Gestational' },
        { value: 'prediabetes', label: 'Prediabetes' },
      ],
      value: data.diabetesType,
      onChange: (value) => updateField('diabetesType', value),
    },
    {
      id: 'current-status',
      label: 'Current Status:',
      type: 'radio',
      options: [
        { value: 'controlled', label: 'Controlled' },
        { value: 'uncontrolled', label: 'Uncontrolled' },
        { value: 'under-md-care', label: 'Under MD care' },
      ],
      value: data.currentStatus,
      onChange: (value) => updateField('currentStatus', value),
    },
    {
      id: 'onset',
      label: 'Onset:',
      type: 'text',
      placeholder: 'e.g., Last 5 years, Last 10 years, Childhood',
      value: data.onset,
      onChange: (value) => updateField('onset', value),
    },
    {
      id: 'medications',
      label: 'Medications:',
      type: 'text',
      placeholder: 'e.g., Insulin, Metformin',
      value: data.medications,
      onChange: (value) => updateField('medications', value),
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
      title="Diabetes"
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





