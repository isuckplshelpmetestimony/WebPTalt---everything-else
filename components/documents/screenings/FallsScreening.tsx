'use client';

import React from 'react';
import { ScreeningSection, ScreeningQuestion } from '../ScreeningSection';
import { HelpCircle } from 'lucide-react';

export interface FallsScreeningData {
  hasFallsHistory?: 'yes' | 'no';
  riskAssessmentCompleted?: boolean;
  planOfCareCompleted?: boolean;
  additionalNotes?: string;
  reasonsForNotCompleting?: string[];
}

interface FallsScreeningProps {
  data: FallsScreeningData;
  onChange: (data: FallsScreeningData) => void;
}

export const FallsScreening: React.FC<FallsScreeningProps> = ({
  data,
  onChange,
}) => {
  const updateField = (field: keyof FallsScreeningData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const questions: ScreeningQuestion[] = [
    {
      id: 'falls-history',
      label: 'Has the patient had two or more documented falls in the past year or any fall with injury in the past year?',
      type: 'yes-no',
      value: data.hasFallsHistory,
      onChange: (value) => updateField('hasFallsHistory', value),
    },
  ];

  const reasonsForNotCompletingOptions = [
    { value: 'not-ambulatory', label: 'Patient is not ambulatory' },
    { value: 'bed-ridden', label: 'Bed ridden' },
    { value: 'immobile', label: 'Immobile' },
    { value: 'confined-chair', label: 'Confined chair' },
    { value: 'wheelchair-bound', label: 'Wheelchair bound' },
    { value: 'dependent-wheelchair', label: 'Dependent on helper pushing wheelchair' },
    { value: 'independent-wheelchair', label: 'Independent in wheelchair' },
    { value: 'minimal-help-wheelchair', label: 'Minimal help in wheelchair' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <ScreeningSection
      title="Falls"
      questions={questions}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.riskAssessmentCompleted || false}
              onChange={(e) => updateField('riskAssessmentCompleted', e.target.checked)}
              className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
            />
            <span className="text-body-sm font-medium text-gray-700">
              Falls Risk Assessment Completed
            </span>
          </label>
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-96 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
              Risk Assessment is defined as 'comprising of balance/gait AND one or more of the following: postural blood pressure, vision, home fall hazards, and documentation on whether medications are a contributing factor or not to falls within the past 12 months.'
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.planOfCareCompleted || false}
              onChange={(e) => updateField('planOfCareCompleted', e.target.checked)}
              className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
            />
            <span className="text-body-sm font-medium text-gray-700">
              Falls Risk Plan of Care Completed
            </span>
          </label>
          <div className="group relative">
            <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-96 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
              Plan of Care including documentation that balance, strength, and gait training/instructions were provided or referral to an exercise program, which includes at least one of the three components: balance, strength or gait OR referral to physical therapy.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-body-sm font-medium text-gray-700">
          Falls Assessment / POC Additional Notes
        </label>
        <textarea
          value={data.additionalNotes || ''}
          onChange={(e) => updateField('additionalNotes', e.target.value)}
          rows={4}
          className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border"
        />
      </div>

      <div className="space-y-2">
        <label className="text-body-sm font-medium text-gray-700">
          Reasons For Not Completing a Risk Assessment and/or Plan of Care
        </label>
        <div className="grid grid-cols-2 gap-2">
          {reasonsForNotCompletingOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.reasonsForNotCompleting?.includes(option.value) || false}
                onChange={(e) => {
                  const current = data.reasonsForNotCompleting || [];
                  const updated = e.target.checked
                    ? [...current, option.value]
                    : current.filter(v => v !== option.value);
                  updateField('reasonsForNotCompleting', updated);
                }}
                className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
              />
              <span className="text-body-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </ScreeningSection>
  );
};



