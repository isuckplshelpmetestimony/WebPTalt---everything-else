'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface DatePickerProps {
  value?: Date | string;
  onChange?: (value: Date | string) => void;
  placeholder?: string;
  allowApproximate?: boolean;
  error?: string;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select date or enter approximate date',
  allowApproximate = true,
  error,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value instanceof Date) {
      setInputValue(value.toISOString().split('T')[0]);
    } else if (typeof value === 'string') {
      setInputValue(value);
      // Check if it's a relative date (e.g., "3 months prior")
      if (value.match(/\d+\s+(month|week|day|year)/i)) {
        setShowWarning(true);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleDateSelect = (date: Date) => {
    setInputValue(date.toISOString().split('T')[0]);
    onChange?.(date);
    setIsOpen(false);
    setShowWarning(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Check if it's a date string (YYYY-MM-DD)
    if (newValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const date = new Date(newValue);
      if (!isNaN(date.getTime())) {
        onChange?.(date);
        setShowWarning(false);
        return;
      }
    }

    // Check if it's a relative date
    if (newValue.match(/\d+\s+(month|week|day|year)/i)) {
      setShowWarning(true);
      onChange?.(newValue);
    } else if (allowApproximate && newValue.trim()) {
      // Allow approximate dates like "mid-March 2025", "late March 2025"
      onChange?.(newValue);
      setShowWarning(false);
    }
  };

  const handleApproximateSelect = (approximate: string) => {
    setInputValue(approximate);
    onChange?.(approximate);
    setIsOpen(false);
    setShowWarning(false);
  };

  const approximateOptions = [
    'Early January',
    'Mid January',
    'Late January',
    'Early February',
    'Mid February',
    'Late February',
    'Early March',
    'Mid March',
    'Late March',
    'Early April',
    'Mid April',
    'Late April',
    'Early May',
    'Mid May',
    'Late May',
    'Early June',
    'Mid June',
    'Late June',
    'Early July',
    'Mid July',
    'Late July',
    'Early August',
    'Mid August',
    'Late August',
    'Early September',
    'Mid September',
    'Late September',
    'Early October',
    'Mid October',
    'Late October',
    'Early November',
    'Mid November',
    'Late November',
    'Early December',
    'Mid December',
    'Late December',
  ];

  const currentYear = new Date().getFullYear();
  const approximateOptionsWithYear = approximateOptions.map(opt => `${opt} ${currentYear}`);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={clsx(
            'w-full px-2.5 py-1.5 border rounded-md text-body bg-white',
            'focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent',
            error ? 'border-cairos-alert' : 'border-cairos-border',
            className
          )}
        />
        <Calendar className="absolute right-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {showWarning && (
        <div className="mt-1 flex items-center gap-1 text-body-xs text-amber-600">
          <AlertCircle className="w-3 h-3" />
          <span>Consider using a specific date (e.g., "mid-March 2025") instead of relative dates for accuracy</span>
        </div>
      )}

      {error && (
        <p className="mt-1 text-body-sm text-cairos-alert">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white border border-cairos-border rounded-lg shadow-lg p-4 w-80">
          <div className="space-y-2">
            <div>
              <label className="text-body-xs font-medium text-gray-700 mb-1 block">
                Select Date:
              </label>
              <input
                type="date"
                value={inputValue.match(/^\d{4}-\d{2}-\d{2}$/) ? inputValue : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleDateSelect(new Date(e.target.value));
                  }
                }}
                className="w-full px-2 py-1.5 text-body-xs border border-cairos-border rounded-md focus:outline-none focus:ring-2 focus:ring-cairos-primary"
              />
            </div>
            {allowApproximate && (
              <div>
                <label className="text-body-xs font-medium text-gray-700 mb-1 block">
                  Or Select Approximate Date:
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleApproximateSelect(e.target.value);
                    }
                  }}
                  className="w-full px-2 py-1.5 text-body-xs border border-cairos-border rounded-md focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                >
                  <option value="">Select approximate date...</option>
                  {approximateOptionsWithYear.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};





