'use client';

import React from 'react';
import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-body-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-2.5 py-1.5 border rounded-md text-body bg-white',
          'focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent',
          error ? 'border-cairos-alert' : 'border-cairos-border',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-body-sm text-cairos-alert">{error}</p>
      )}
    </div>
  );
};

