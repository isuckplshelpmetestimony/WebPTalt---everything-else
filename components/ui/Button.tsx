'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cancel';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-cairos-primary text-white hover:bg-opacity-90 focus:ring-cairos-primary',
    secondary: 'bg-cairos-bgSecondary text-gray-900 border border-cairos-border hover:bg-gray-100 focus:ring-gray-300',
    cancel: 'bg-white text-gray-700 border border-cairos-border hover:bg-gray-50 focus:ring-gray-300',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-body-sm',
    md: 'px-3.5 py-1.5 text-body',
    lg: 'px-4 py-2 text-body-lg',
  };
  
  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

