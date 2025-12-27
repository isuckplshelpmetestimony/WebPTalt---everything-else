'use client';

import React, { useState } from 'react';
import { Document } from '@/lib/types/document';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

interface SOAPNoteViewProps {
  document: Document;
}

export const SOAPNoteView: React.FC<SOAPNoteViewProps> = ({ document }) => {
  const [expandedSections, setExpandedSections] = useState({
    subjective: true,
    objective: true,
    assessment: true,
    plan: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      id: 'subjective' as const,
      title: 'Subjective',
      content: document.content?.subjective,
      description: 'Current condition, pain history, functional status, medical history',
    },
    {
      id: 'objective' as const,
      title: 'Objective',
      content: document.content?.objective,
      description: 'Vitals, observation, ROM, muscle testing, special tests, neurological testing',
    },
    {
      id: 'assessment' as const,
      title: 'Assessment',
      content: document.content?.assessment,
      description: 'Problem list, goals (short-term and long-term)',
    },
    {
      id: 'plan' as const,
      title: 'Plan',
      content: document.content?.plan,
      description: 'Treatment frequency, duration, modalities with justification, exercises',
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isExpanded = expandedSections[section.id];
        const hasContent = !!section.content;

        return (
          <Card key={section.id} className="p-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between mb-2"
            >
              <div className="flex items-center gap-3">
                <h3 className="text-h3 text-gray-900">{section.title}</h3>
                {!hasContent && (
                  <span className="text-body-xs text-gray-400 italic">(No content)</span>
                )}
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <p className="text-body-xs text-gray-500 mb-3">{section.description}</p>
            
            {isExpanded && hasContent && (
              <div className="pt-3 border-t border-cairos-border">
                <div className="text-body text-gray-700 whitespace-pre-wrap">
                  {section.content}
                </div>
              </div>
            )}
            
            {isExpanded && !hasContent && (
              <div className="pt-3 border-t border-cairos-border">
                <p className="text-body-sm text-gray-400 italic">No content available for this section.</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

