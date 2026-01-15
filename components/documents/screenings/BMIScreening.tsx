'use client';

import React, { useMemo } from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface BMIScreeningData {
  height?: number; // in inches
  weight?: number; // in pounds
}

interface BMIScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: BMIScreeningData;
  onChange: (data: BMIScreeningData) => void;
}

export const BMIScreening: React.FC<BMIScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof BMIScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const bmi = useMemo(() => {
    if (!data.height || !data.weight || data.height <= 0 || data.weight <= 0) {
      return null;
    }
    // BMI = (weight in pounds / (height in inches)^2) * 703
    const heightInMeters = data.height * 0.0254;
    const weightInKg = data.weight * 0.453592;
    return weightInKg / (heightInMeters * heightInMeters);
  }, [data.height, data.weight]);

  const bmiCategory = useMemo(() => {
    if (!bmi) return null;
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }, [bmi]);

  const questions: ScreeningQuestion[] = [
    {
      id: 'height',
      label: 'Height (inches):',
      type: 'number',
      value: data.height,
      onChange: (value) => updateField('height', value ? Number(value) : undefined),
    },
    {
      id: 'weight',
      label: 'Weight (pounds):',
      type: 'number',
      value: data.weight,
      onChange: (value) => updateField('weight', value ? Number(value) : undefined),
    },
  ];

  return (
    <ScreeningSection
      title="BMI"
      questions={questions}
      sectionId={sectionId}
      isRecording={isRecording}
      isProcessing={isProcessing}
      isMicModeEnabled={isMicModeEnabled}
      onMicClick={onMicClick}
      micModePrompts={micModePrompts}
    >
      {bmi !== null && (
        <div className="pt-4 border-t border-cairos-border">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-body-sm font-medium text-gray-700">BMI:</span>
              <span className="text-body-lg font-semibold text-gray-900">
                {bmi.toFixed(1)}
              </span>
            </div>
            {bmiCategory && (
              <div className="mt-2">
                <span className="text-body-sm text-gray-600">Category: </span>
                <span className="text-body-sm font-medium text-gray-900">{bmiCategory}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </ScreeningSection>
  );
};





