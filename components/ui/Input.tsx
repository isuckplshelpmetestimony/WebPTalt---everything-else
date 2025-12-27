'use client';

import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-body-sm font-medium text-gray-700 mb-8">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-2.5 py-1.5 border rounded-md text-body bg-white',
          'focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent',
          error ? 'border-cairos-alert' : 'border-cairos-border',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-8 text-body-sm text-cairos-alert">{error}</p>
      )}
    </div>
  );
};

