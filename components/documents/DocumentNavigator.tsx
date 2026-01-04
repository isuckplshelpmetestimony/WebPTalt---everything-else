'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Patient, Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';

interface DocumentNavigatorProps {
  patient: Patient;
  activeCase?: Case;
  entryDate: Date;
  timeIn: string;
  timeOut: string;
  vitals?: { bloodPressure?: string; heartRate?: number; oxygenSaturation?: number };
  subjectiveSections: {
    id: string;
    label: string;
    completed?: boolean;
    subsections?: { id: string; label: string; completed?: boolean }[];
  }[];
  objectiveSections: {
    id: string;
    label: string;
    completed?: boolean;
    subsections?: { id: string; label: string; completed?: boolean }[];
  }[];
  billingCompleted?: boolean;
  onSectionClick?: (sectionId: string) => void;
  onVitalsChange?: (vitals: { bloodPressure?: string; heartRate?: number; oxygenSaturation?: number }) => void;
  onTimeInChange?: (time: string) => void;
  onTimeOutChange?: (time: string) => void;
}

export const DocumentNavigator: React.FC<DocumentNavigatorProps> = ({
  patient,
  activeCase,
  entryDate,
  timeIn,
  timeOut,
  vitals,
  subjectiveSections,
  objectiveSections,
  billingCompleted = false,
  onSectionClick,
  onVitalsChange,
  onTimeInChange,
  onTimeOutChange,
}) => {
  const [vitalsExpanded, setVitalsExpanded] = useState(false);
  const [subjectiveExpanded, setSubjectiveExpanded] = useState(true);
  const [objectiveExpanded, setObjectiveExpanded] = useState(true);
  const [billingExpanded, setBillingExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-cairos-border h-screen overflow-y-auto sticky top-0">
      <div className="p-4 space-y-4">
        {/* Vitals Section */}
        <div className="border-b border-cairos-border pb-4">
          <button
            onClick={() => setVitalsExpanded(!vitalsExpanded)}
            className="flex items-center justify-between w-full text-body-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors"
          >
            <span>Vitals</span>
            {vitalsExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {vitalsExpanded && (
            <div className="mt-2 space-y-2 pl-4">
              <div className="space-y-2">
                <label className="text-body-xs font-medium text-gray-600">Blood Pressure</label>
                <input
                  type="text"
                  value={vitals?.bloodPressure || ''}
                  onChange={(e) => onVitalsChange?.({ ...vitals, bloodPressure: e.target.value })}
                  placeholder="e.g., 120/80"
                  className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-body-xs font-medium text-gray-600">Heart Rate</label>
                <input
                  type="number"
                  value={vitals?.heartRate || ''}
                  onChange={(e) => onVitalsChange?.({ ...vitals, heartRate: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="bpm"
                  className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-body-xs font-medium text-gray-600">O2 Saturation</label>
                <input
                  type="number"
                  value={vitals?.oxygenSaturation || ''}
                  onChange={(e) => onVitalsChange?.({ ...vitals, oxygenSaturation: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="%"
                  className="w-full px-2 py-1 text-body-xs border border-cairos-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                />
              </div>
            </div>
          )}
        </div>

        {/* Options Section */}
        <div className="border-b border-cairos-border pb-4">
          <div className="text-body-sm font-semibold text-gray-700 mb-2">Options</div>
          <div className="space-y-2 text-body-xs text-gray-600">
            <div>
              <span className="font-medium">Case Name:</span> {activeCase?.name || 'No case assigned'}
            </div>
            <div>
              <span className="font-medium">Date of Service:</span> {formatDate(entryDate)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <span className="font-medium">Time In:</span>
                <div className="relative flex-1">
                  <input
                    type="time"
                    value={timeIn}
                    onChange={(e) => onTimeInChange?.(e.target.value)}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      input.focus();
                      if ('showPicker' in HTMLInputElement.prototype) {
                        (input as any).showPicker();
                      }
                    }}
                    className="w-full pl-2 pr-8 py-1 text-body-xs border border-cairos-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary cursor-pointer"
                    title="Click to select time"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Time Out:</span>
                <div className="relative flex-1">
                  <input
                    type="time"
                    value={timeOut}
                    onChange={(e) => onTimeOutChange?.(e.target.value)}
                    onClick={(e) => {
                      const input = e.currentTarget;
                      input.focus();
                      if ('showPicker' in HTMLInputElement.prototype) {
                        (input as any).showPicker();
                      }
                    }}
                    className="w-full pl-2 pr-8 py-1 text-body-xs border border-cairos-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary cursor-pointer"
                    title="Click to select time"
                  />
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subjective Section */}
        <div>
          <button
            onClick={() => setSubjectiveExpanded(!subjectiveExpanded)}
            className="flex items-center justify-between w-full text-body-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors mb-2"
          >
            <span>Subjective</span>
            {subjectiveExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {subjectiveExpanded && (
            <div className="space-y-1">
              {subjectiveSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      if (section.subsections && section.subsections.length > 0) {
                        toggleSection(section.id);
                      } else {
                        handleSectionClick(section.id);
                      }
                    }}
                    className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-body-xs hover:bg-gray-50 transition-colors ${
                      section.completed ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {section.subsections && section.subsections.length > 0 ? (
                      expandedSections.has(section.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <input
                      type="checkbox"
                      checked={section.completed || false}
                      readOnly
                      className="w-3 h-3 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                    />
                    <span className="flex-1">{section.label}</span>
                    {section.completed && (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    )}
                  </button>
                  {section.subsections && expandedSections.has(section.id) && (
                    <div className="ml-6 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => handleSectionClick(subsection.id)}
                          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-body-xs hover:bg-gray-50 transition-colors ${
                            subsection.completed ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={subsection.completed || false}
                            readOnly
                            className="w-3 h-3 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                          />
                          <span className="flex-1">{subsection.label}</span>
                          {subsection.completed && (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Objective Section */}
        <div>
          <button
            onClick={() => setObjectiveExpanded(!objectiveExpanded)}
            className="flex items-center justify-between w-full text-body-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors mb-2"
          >
            <span>Objective</span>
            {objectiveExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {objectiveExpanded && (
            <div className="space-y-1">
              {objectiveSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => {
                      if (section.subsections && section.subsections.length > 0) {
                        toggleSection(section.id);
                      } else {
                        handleSectionClick(section.id);
                      }
                    }}
                    className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-body-xs hover:bg-gray-50 transition-colors ${
                      section.completed ? 'text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {section.subsections && section.subsections.length > 0 ? (
                      expandedSections.has(section.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <input
                      type="checkbox"
                      checked={section.completed || false}
                      readOnly
                      className="w-3 h-3 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                    />
                    <span className="flex-1">{section.label}</span>
                    {section.completed && (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    )}
                  </button>
                  {section.subsections && expandedSections.has(section.id) && (
                    <div className="ml-6 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => handleSectionClick(subsection.id)}
                          className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-body-xs hover:bg-gray-50 transition-colors ${
                            subsection.completed ? 'text-gray-900' : 'text-gray-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={subsection.completed || false}
                            readOnly
                            className="w-3 h-3 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                          />
                          <span className="flex-1">{subsection.label}</span>
                          {subsection.completed && (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing Section */}
        <div>
          <button
            onClick={() => {
              setBillingExpanded(!billingExpanded);
              handleSectionClick('billing');
            }}
            className="flex items-center justify-between w-full text-body-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors mb-2"
          >
            <span>Billing</span>
            {billingExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            )}
          </button>
          {billingExpanded && (
            <div className="space-y-1">
              <button
                onClick={() => handleSectionClick('billing')}
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-body-xs hover:bg-gray-50 transition-colors ${
                  billingCompleted ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!billingCompleted}
                  readOnly
                  className="w-3 h-3 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                />
                <span className="flex-1">Charges</span>
                {billingCompleted && (
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

