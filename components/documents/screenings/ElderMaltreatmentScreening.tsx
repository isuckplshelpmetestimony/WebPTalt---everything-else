'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';

export interface ElderMaltreatmentScreeningData {
  screeningPerformed?: 'yes' | 'no';
  screeningResults?: 'positive' | 'negative';
  toolDescription?: string;
  followUpPlanDocumented?: 'yes' | 'no';
}

interface ElderMaltreatmentScreeningProps {
  data: ElderMaltreatmentScreeningData;
  onChange: (data: ElderMaltreatmentScreeningData) => void;
}

export const ElderMaltreatmentScreening: React.FC<ElderMaltreatmentScreeningProps> = ({
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

