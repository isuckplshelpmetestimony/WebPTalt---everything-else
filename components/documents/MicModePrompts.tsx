'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { SectionPrompts, Prompt } from '@/lib/prompts/subjectivePrompts';
import { Mic } from 'lucide-react';

interface MicModePromptsProps {
  sectionPrompts: SectionPrompts;
  isActive?: boolean;
}

export const MicModePrompts: React.FC<MicModePromptsProps> = ({ sectionPrompts, isActive = false }) => {
  if (!isActive) {
    return null;
  }
  return (
    <Card className="p-5 mb-4" style={{ display: 'block', visibility: 'visible', opacity: 1, height: 'auto', minHeight: '100px' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
          <Mic className="w-5 h-5 text-cairos-primary" />
        </div>
        <h3 className="text-h3 text-gray-900">{sectionPrompts.sectionTitle}</h3>
      </div>

      <div className="space-y-4 pt-4 border-t border-cairos-border">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-body-sm text-blue-900 font-medium">
            💡 Mic Mode Active: Use these prompts to guide your conversation with the patient. 
            The session will be recorded for documentation purposes.
          </p>
        </div>

        <div className="space-y-6">
          {sectionPrompts.prompts.map((prompt, index) => (
            <div key={prompt.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cairos-primary bg-opacity-10 flex items-center justify-center mt-0.5">
                  <span className="text-body-sm font-semibold text-cairos-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-body font-medium text-gray-900 mb-2">
                    {prompt.question}
                  </p>
                  {prompt.followUp && prompt.followUp.length > 0 && (
                    <div className="ml-4 mt-2 space-y-1">
                      {prompt.followUp.map((followUp, idx) => (
                        <p key={idx} className="text-body-sm text-gray-600 italic">
                          • {followUp}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {index < sectionPrompts.prompts.length - 1 && (
                <div className="border-b border-cairos-border pt-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};



