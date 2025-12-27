'use client';

import React from 'react';
import { Provider } from '@/lib/types/schedule';
import { clsx } from 'clsx';

interface ResourcePanelProps {
  providers: Provider[];
  selectedProviders: string[];
  onToggleProvider: (providerId: string) => void;
}

export const ResourcePanel: React.FC<ResourcePanelProps> = ({
  providers,
  selectedProviders,
  onToggleProvider,
}) => {
  return (
    <div className="w-64 flex-shrink-0 border-l border-cairos-border p-4">
      <h3 className="text-h3 mb-4">Providers</h3>
      <div className="space-y-2">
        {providers.map((provider) => {
          const isSelected = selectedProviders.includes(provider.id);
          
          return (
            <label
              key={provider.id}
              className={clsx(
                'flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors',
                isSelected
                  ? 'bg-cairos-primary bg-opacity-10'
                  : 'hover:bg-gray-100'
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleProvider(provider.id)}
                className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
              />
              <div className="flex-1">
                <div className="text-body font-medium">{provider.name}</div>
                <div className="text-body-sm text-gray-600">{provider.role}</div>
              </div>
              {provider.status && (
                <div
                  className={clsx(
                    'w-12 h-12 rounded-full',
                    provider.status === 'available'
                      ? 'bg-cairos-success'
                      : provider.status === 'busy'
                      ? 'bg-cairos-warning'
                      : 'bg-gray-300'
                  )}
                  title={provider.status}
                />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

