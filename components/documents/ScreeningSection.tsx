'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { AlertCircle, HelpCircle, Mic } from 'lucide-react';

export interface ScreeningQuestion {
  id: string;
  label: string;
  helpText?: string;
  type: 'yes-no' | 'radio' | 'checkbox' | 'text' | 'textarea' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

export interface ScreeningValidation {
  isValid: boolean;
  errorMessage?: string;
}

interface ScreeningSectionProps {
  title: string;
  questions: ScreeningQuestion[];
  validation?: ScreeningValidation;
  children?: React.ReactNode;
  className?: string;
  sectionId?: string;
  isRecording?: boolean;
  isProcessing?: boolean;
  isMicModeEnabled?: boolean;
  onMicClick?: () => void;
  micModePrompts?: React.ReactNode;
}

export const ScreeningSection: React.FC<ScreeningSectionProps> = ({
  title,
  questions,
  validation,
  children,
  className,
  sectionId,
  isRecording = false,
  isProcessing = false,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
}) => {
  const renderQuestion = (question: ScreeningQuestion) => {
    switch (question.type) {
      case 'yes-no':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-body-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-cairos-alert ml-1">*</span>}
              </label>
              {question.helpText && (
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
                    {question.helpText}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="yes"
                  checked={question.value === 'yes' || question.value === true}
                  onChange={() => question.onChange?.('yes')}
                  className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                />
                <span className="text-body-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value="no"
                  checked={question.value === 'no' || question.value === false}
                  onChange={() => question.onChange?.('no')}
                  className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                />
                <span className="text-body-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-body-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-cairos-alert ml-1">*</span>}
              </label>
              {question.helpText && (
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
                    {question.helpText}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {question.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={question.value === option.value}
                    onChange={() => question.onChange?.(option.value)}
                    className="w-4 h-4 text-cairos-primary focus:ring-cairos-primary"
                  />
                  <span className="text-body-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-body-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-cairos-alert ml-1">*</span>}
              </label>
              {question.helpText && (
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
                    {question.helpText}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Array.isArray(question.value) && question.value.includes(option.value)}
                    onChange={(e) => {
                      const current = Array.isArray(question.value) ? question.value : [];
                      const updated = e.target.checked
                        ? [...current, option.value]
                        : current.filter(v => v !== option.value);
                      question.onChange?.(updated);
                    }}
                    className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
                  />
                  <span className="text-body-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-body-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-cairos-alert ml-1">*</span>}
              </label>
              {question.helpText && (
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
                    {question.helpText}
                  </div>
                </div>
              )}
            </div>
            <textarea
              value={question.value || ''}
              onChange={(e) => question.onChange?.(e.target.value)}
              placeholder={question.options?.[0]?.label}
              rows={3}
              className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border"
            />
          </div>
        );

      case 'number':
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-body-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-cairos-alert ml-1">*</span>}
              </label>
              {question.helpText && (
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
                    {question.helpText}
                  </div>
                </div>
              )}
            </div>
            <Input
              type="number"
              value={question.value || ''}
              onChange={(e) => question.onChange?.(e.target.value)}
              placeholder={question.placeholder || question.options?.[0]?.label}
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div key={question.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-body-sm font-medium text-gray-700">
                {question.label}
                {question.required && <span className="text-cairos-alert ml-1">*</span>}
              </label>
              {question.helpText && (
                <div className="group relative">
                  <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 top-6 z-10 hidden group-hover:block w-64 p-2 bg-gray-900 text-white text-body-xs rounded-lg shadow-lg">
                    {question.helpText}
                  </div>
                </div>
              )}
            </div>
            <Input
              value={question.value || ''}
              onChange={(e) => question.onChange?.(e.target.value)}
              placeholder={question.placeholder || question.options?.[0]?.label}
            />
          </div>
        );
    }
  };

  return (
    <Card className={`p-5 ${className || ''}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-h3 text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            {validation && !validation.isValid && (
              <div className="flex items-center gap-2 text-cairos-alert">
                <AlertCircle className="w-5 h-5" />
                <span className="text-body-sm">{validation.errorMessage}</span>
              </div>
            )}
            {onMicClick && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onMicClick();
                  }}
                  disabled={isProcessing}
                  className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                    isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Mic className={`w-5 h-5 ${
                      isRecording 
                        ? 'text-red-600 animate-pulse' 
                        : isMicModeEnabled 
                          ? 'text-green-600' 
                          : 'text-gray-400'
                    }`} />
                  )}
                </button>
                {isRecording && (
                  <span className="text-body-sm text-red-600 font-medium">Recording...</span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-cairos-border">
          {micModePrompts ? (
            <div>
              {micModePrompts}
            </div>
          ) : (
            <>
              {questions.map(renderQuestion)}
              {children}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};





