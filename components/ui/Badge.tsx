import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'alert' | 'primary';
  size?: 'xs' | 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-cairos-success bg-opacity-10 text-cairos-success',
    warning: 'bg-cairos-warning bg-opacity-10 text-cairos-warning',
    alert: 'bg-cairos-alert bg-opacity-10 text-cairos-alert',
    primary: 'bg-cairos-primary bg-opacity-10 text-cairos-primary',
  };
  
  const sizes = {
    xs: 'px-[0.9rem] py-[0.45rem] text-body-xs',
    sm: 'px-[1.125rem] py-[0.5625rem] text-body-sm',
    md: 'px-[1.35rem] py-[0.675rem] text-body-sm',
  };
  
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-medium',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
};

