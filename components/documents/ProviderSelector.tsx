'use client';

import React from 'react';
import { User } from 'lucide-react';
import { Select } from '../ui/Select';

interface Provider {
  id: string;
  name: string;
}

interface ProviderSelectorProps {
  providers: Provider[];
  renderingProviderId?: string;
  coSigningProviderId?: string;
  onRenderingProviderChange: (providerId: string) => void;
  onCoSigningProviderChange: (providerId: string) => void;
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  renderingProviderId,
  coSigningProviderId,
  onRenderingProviderChange,
  onCoSigningProviderChange,
}) => {
  const providerOptions = providers.map((p) => ({
    value: p.id,
    label: p.name,
  }));
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-gray-600" />
        <h3 className="text-h3">Provider Assignment</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Rendering Provider"
          options={[{ value: '', label: 'Select provider...' }, ...providerOptions]}
          value={renderingProviderId || ''}
          onChange={(e) => onRenderingProviderChange(e.target.value)}
        />
        
        <Select
          label="Co-signing Provider (Optional)"
          options={[{ value: '', label: 'None' }, ...providerOptions]}
          value={coSigningProviderId || ''}
          onChange={(e) => onCoSigningProviderChange(e.target.value)}
        />
      </div>
    </div>
  );
};

