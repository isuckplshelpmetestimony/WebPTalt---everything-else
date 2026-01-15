'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { subjectivePrompts } from '@/lib/prompts/subjectivePrompts';

interface ExtractionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  extractedSections: Set<string>;
  onContinueRecording: () => void;
}

export function ExtractionSummaryModal({
  isOpen,
  onClose,
  extractedSections,
  onContinueRecording,
}: ExtractionSummaryModalProps) {
  const allSectionIds = subjectivePrompts.map(section => section.sectionId);
  const extractedCount = extractedSections.size;
  const totalCount = allSectionIds.length;
  const missingSections = allSectionIds.filter(id => !extractedSections.has(id));
  const hasManyMissing = missingSections.length >= 3;

  const getSectionTitle = (sectionId: string) => {
    return subjectivePrompts.find(s => s.sectionId === sectionId)?.sectionTitle || sectionId;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Extraction Summary">
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Sections Extracted</p>
            <p className="text-2xl font-semibold text-cairos-primary">
              {extractedCount} of {totalCount}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Missing Sections</p>
            <p className={`text-2xl font-semibold ${hasManyMissing ? 'text-cairos-warning' : 'text-gray-400'}`}>
              {missingSections.length}
            </p>
          </div>
        </div>

        {/* Warning if many sections missing */}
        {hasManyMissing && (
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-yellow-900 mb-1">
                Only {extractedCount} of {totalCount} sections were extracted
              </p>
              <p className="text-sm text-yellow-800 mb-2">
                The following sections have not been recorded yet:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                {missingSections.map(sectionId => (
                  <li key={sectionId}>{getSectionTitle(sectionId)}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Extracted Sections List */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Extracted Sections</h3>
          <div className="space-y-2">
            {allSectionIds
              .filter(id => extractedSections.has(id))
              .map(sectionId => (
                <div key={sectionId} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{getSectionTitle(sectionId)}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Missing Sections List */}
        {missingSections.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Missing Sections</h3>
            <div className="space-y-2">
              {missingSections.map(sectionId => (
                <div key={sectionId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{getSectionTitle(sectionId)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-cairos-border">
          {hasManyMissing && (
            <Button
              onClick={onContinueRecording}
              className="flex-1 bg-cairos-primary text-white hover:bg-opacity-90"
            >
              Continue Recording
            </Button>
          )}
          <Button
            onClick={onClose}
            className={hasManyMissing ? 'flex-1' : 'w-full'}
            variant="secondary"
          >
            {hasManyMissing ? 'Review & Close' : 'Close'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}



