import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'alert';
  title?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
    success: {
      bg: 'bg-cairos-success bg-opacity-10',
      border: 'border-cairos-success border-opacity-30',
      text: 'text-cairos-success',
      icon: CheckCircle,
      iconColor: 'text-cairos-success',
    },
    warning: {
      bg: 'bg-cairos-warning bg-opacity-10',
      border: 'border-cairos-warning border-opacity-30',
      text: 'text-cairos-warning',
      icon: AlertTriangle,
      iconColor: 'text-cairos-warning',
    },
    alert: {
      bg: 'bg-cairos-alert bg-opacity-10',
      border: 'border-cairos-alert border-opacity-30',
      text: 'text-cairos-alert',
      icon: AlertCircle,
      iconColor: 'text-cairos-alert',
    },
  };
  
  const config = variants[variant];
  const Icon = config.icon;
  
  return (
    <div
      className={clsx(
        'rounded-md border p-3 flex gap-2',
        config.bg,
        config.border,
        config.text
      )}
    >
      <Icon className={clsx('w-4 h-4 flex-shrink-0 mt-0.5', config.iconColor)} />
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold text-body mb-1">{title}</h4>
        )}
        <div className="text-body-sm">{children}</div>
      </div>
    </div>
  );
};

