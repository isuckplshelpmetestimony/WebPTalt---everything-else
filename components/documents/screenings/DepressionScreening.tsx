'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface DepressionScreeningData {
  hasBipolarDisorder?: 'yes' | 'no';
  screeningPerformed?: 'yes' | 'no';
  screeningQuestion1?: string; // PHQ-2 Question 1 response
  screeningQuestion2?: string; // PHQ-2 Question 2 response
  screeningResults?: 'positive' | 'negative';
  screeningToolDescription?: string;
  followUpPlan?: string[];
  followUpPlanComments?: string;
}

interface DepressionScreeningProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  data: DepressionScreeningData;
  onChange: (data: DepressionScreeningData) => void;
}

export const DepressionScreening: React.FC<DepressionScreeningProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  data,
  onChange,
}) => {
  const updateField = (field: keyof DepressionScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const validate = (): { isValid: boolean; errorMessage?: string } => {
    if (data.screeningPerformed === 'yes' && !data.screeningToolDescription && !data.screeningResults) {
      return {
        isValid: false,
        errorMessage: 'Depression screening not documented, reason not given',
      };
    }
    return { isValid: true };
  };

  const validation = validate();

  const phq2ResponseOptions = [
    { value: 'not-at-all', label: 'Not at all' },
    { value: 'several-days', label: 'Several days' },
    { value: 'more-than-half', label: 'More than half the days' },
    { value: 'nearly-every-day', label: 'Nearly every day' },
  ];

  const questions: ScreeningQuestion[] = [
    {
      id: 'bipolar',
      label: 'Does the patient have a pre-existing diagnosis for bipolar disorder?',
      type: 'yes-no',
      value: data.hasBipolarDisorder,
      onChange: (value) => updateField('hasBipolarDisorder', value),
    },
    {
      id: 'screening-performed',
      label: 'Was this patient screened for depression?',
      type: 'yes-no',
      required: true,
      value: data.screeningPerformed,
      onChange: (value) => updateField('screeningPerformed', value),
    },
    {
      id: 'screening-question-1',
      label: 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
      type: 'radio' as const,
      options: phq2ResponseOptions,
      value: data.screeningQuestion1,
      onChange: (value) => updateField('screeningQuestion1', value),
    },
    {
      id: 'screening-question-2',
      label: 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
      type: 'radio' as const,
      options: phq2ResponseOptions,
      value: data.screeningQuestion2,
      onChange: (value) => updateField('screeningQuestion2', value),
    },
    {
      id: 'screening-results',
      label: 'Screening Results:',
      type: 'radio' as const,
      options: [
        { value: 'positive', label: 'Positive' },
        { value: 'negative', label: 'Negative' },
      ],
      value: data.screeningResults,
      onChange: (value) => updateField('screeningResults', value),
    },
    {
      id: 'screening-tool',
      label: 'Screening Tool Description or Reason for Patient Ineligibility:',
      helpText: 'Describe the screening tool used (e.g., PHQ-2, PHQ-9) or provide reason if patient is ineligible',
      type: 'textarea' as const,
      value: data.screeningToolDescription,
      onChange: (value) => updateField('screeningToolDescription', value),
    },
  ];

  const followUpPlanOptions = [
    { value: 'evaluation', label: 'Additional evaluation or assessment for depression' },
    { value: 'suicide-risk', label: 'Suicide Risk Assessment' },
    { value: 'referral', label: 'Referral to a practitioner who is qualified to diagnose and treat depression' },
    { value: 'pharmacological', label: 'Pharmacological interventions' },
    { value: 'other', label: 'Other interventions or follow-up for the diagnosis or treatment of depression' },
  ];

  return (
    <ScreeningSection
      title="Depression Screening"
      questions={questions}
      validation={validation}
      sectionId={sectionId}
      isRecording={isRecording}
      isProcessing={isProcessing}
      isMicModeEnabled={isMicModeEnabled}
      onMicClick={onMicClick}
      micModePrompts={micModePrompts}
    >
      {data.screeningPerformed === 'yes' && (
        <>
          <div className="space-y-2 pt-4 border-t border-cairos-border">
            <label className="text-body-sm font-medium text-gray-700">
              Follow Up Plan:
            </label>
            <div className="space-y-2">
              {followUpPlanOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.followUpPlan?.includes(option.value) || false}
                    onChange={(e) => {
                      const current = data.followUpPlan || [];
                      const updated = e.target.checked
                        ? [...current, option.value]
                        : current.filter(v => v !== option.value);
                      updateField('followUpPlan', updated);
                    }}
                    className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                  />
                  <span className="text-body-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-body-sm font-medium text-gray-700">
              Follow Up Plan Comments:
            </label>
            <textarea
              value={data.followUpPlanComments || ''}
              onChange={(e) => updateField('followUpPlanComments', e.target.value)}
              rows={3}
              className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border"
            />
          </div>
        </>
      )}
      {validation && !validation.isValid && (
        <div className="pt-4 border-t border-cairos-border">
          <div className="flex items-center gap-2 text-cairos-alert">
            <span className="text-body-sm font-medium">Depression Assessment</span>
            <span className="text-body-sm">X</span>
            <span className="text-body-sm">{validation.errorMessage}</span>
          </div>
        </div>
      )}
    </ScreeningSection>
  );
};





