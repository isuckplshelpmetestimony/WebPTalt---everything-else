'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  style,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  return (
    <div
      className={clsx(
        'card',
        paddingClasses[padding],
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

