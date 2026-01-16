'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ChevronDown, ChevronUp, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const DailyNoteAssessmentSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [progressSummary, setProgressSummary] = useState('Patient demonstrated improvement in shoulder flexion ROM from 115° to 125° (+10°). Pain reduced from 7/10 to 5/10. LEFS score improved from 45/80 to 52/80. Strength maintained at 4/5. Functional test (TUG) improved from 14s to 11s.');
  const [clinicalReasoning, setClinicalReasoning] = useState('Based on patient\'s continued limitation in shoulder flexion (125° vs normal 180°) and positive response to manual therapy, skilled intervention remains necessary to address capsular restriction preventing functional overhead reaching required for ADLs.');
  const [impairment, setImpairment] = useState('');
  const [activityLimitation, setActivityLimitation] = useState('');
  const [participationRestriction, setParticipationRestriction] = useState('');
  const [plateauJustification, setPlateauJustification] = useState('');
  const [hasPlateau, setHasPlateau] = useState(false);

  // Check for generic phrases
  const hasGenericPhrases = clinicalReasoning.toLowerCase().includes('tolerated well') ||
    clinicalReasoning.toLowerCase().includes('continue poc');

  return (
    <Card className="p-5 mb-4 border-4 border-yellow-400">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <h3 className="text-h3 text-gray-900">Assessment</h3>
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-cairos-border">
          {/* Warning Alert */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-body-xs text-yellow-800">
                ⚠️ CRITICAL: Must be unique for every visit. Generic phrases trigger denials.
              </p>
            </div>
          </div>

          {/* Progress Summary */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-body-sm font-medium text-gray-700">
                Progress Summary
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled
                className="flex items-center gap-1.5 opacity-50 cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate Progress Summary
              </Button>
            </div>
            <textarea
              rows={4}
              value={progressSummary}
              onChange={(e) => setProgressSummary(e.target.value)}
              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
              placeholder="Example: Patient demonstrated improvement in shoulder flexion ROM from 115° to 125° (+10°). Pain reduced from 7/10 to 5/10. LEFS score improved from 45/80 to 52/80. Strength maintained at 4/5. Functional test (TUG) improved from 14s to 11s."
            />
          </div>

          {/* Comparison Card */}
          <div className="p-4 bg-gray-50 border border-cairos-border rounded-lg">
            <h4 className="text-body-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              📊 Comparison to Previous Visit
            </h4>
            <ul className="space-y-2 text-body-xs text-gray-700">
              <li>
                <strong>Previous visit (01/14/26):</strong>
              </li>
              <li className="ml-4">
                - Shoulder flexion: 115° | <strong>Today: 125°</strong> | Change: <span className="text-green-600 font-semibold">+10° ✓</span>
              </li>
              <li className="ml-4">
                - Pain: 7/10 | <strong>Today: 5/10</strong> | Change: <span className="text-green-600 font-semibold">-2 ✓</span>
              </li>
              <li className="ml-4">
                - LEFS: 45/80 | <strong>Today: 52/80</strong> | Change: <span className="text-green-600 font-semibold">+7 points ✓</span>
              </li>
            </ul>
          </div>

          {/* Clinical Reasoning */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-body-sm font-medium text-gray-700">
                Clinical Reasoning
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled
                className="flex items-center gap-1.5 opacity-50 cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                AI Suggest Clinical Reasoning
              </Button>
            </div>
            <textarea
              rows={6}
              value={clinicalReasoning}
              onChange={(e) => setClinicalReasoning(e.target.value)}
              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
              placeholder="Example: Based on patient's continued limitation in shoulder flexion (125° vs normal 180°) and positive response to manual therapy, skilled intervention remains necessary to address capsular restriction preventing functional overhead reaching required for ADLs. Patient demonstrates improved pain control with therapeutic exercise, indicating progression toward goals."
            />
            {hasGenericPhrases && clinicalReasoning.length > 0 && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-body-xs text-red-800">
                    ⚠️ Generic phrases detected: 'tolerated well'
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* I-A-P Linkage Card */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-body-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              🔗 Impairment → Activity → Participation
            </h4>
            <div className="space-y-3 mb-3">
              <div>
                <label className="block text-body-xs font-medium text-gray-700 mb-1">Impairment</label>
                <Input
                  type="text"
                  value={impairment}
                  onChange={(e) => setImpairment(e.target.value)}
                  placeholder="e.g., L knee flexion 110°, quad 4/5"
                />
              </div>
              <div>
                <label className="block text-body-xs font-medium text-gray-700 mb-1">Activity Limitation</label>
                <Input
                  type="text"
                  value={activityLimitation}
                  onChange={(e) => setActivityLimitation(e.target.value)}
                  placeholder="e.g., Cannot climb stairs without rail"
                />
              </div>
              <div>
                <label className="block text-body-xs font-medium text-gray-700 mb-1">Participation Restriction</label>
                <Input
                  type="text"
                  value={participationRestriction}
                  onChange={(e) => setParticipationRestriction(e.target.value)}
                  placeholder="e.g., Cannot attend church"
                />
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled
              className="mb-3 opacity-50 cursor-not-allowed"
            >
              Auto-fill from Objective data
            </Button>
            {impairment && activityLimitation && participationRestriction && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-body-xs text-green-800">
                  <strong>Generated Statement:</strong> We are addressing {impairment} (impairment) via therapeutic exercise to improve {activityLimitation} (activity) essential for {participationRestriction} (participation).
                </p>
              </div>
            )}
          </div>

          {/* Plateau Justification - Conditional */}
          {hasPlateau && (
            <div>
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-body-xs text-red-800">
                    ⚠️ PLATEAU DETECTED: No changes for 3 visits. Action required.
                  </p>
                </div>
              </div>
              <label className="block text-body-sm font-medium text-gray-700 mb-2">
                Plateau Justification & Modification
              </label>
              <textarea
                rows={5}
                value={plateauJustification}
                onChange={(e) => setPlateauJustification(e.target.value)}
                className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                placeholder="Explain cause of plateau AND modification made. Example: Plateau due to acute pain flare from weekend overactivity. Modified plan today: reduced load to 15lbs, added pain-management strategies including ice and positioning education."
              />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
