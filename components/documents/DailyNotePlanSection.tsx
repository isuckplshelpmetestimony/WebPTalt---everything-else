'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ChevronDown, ChevronUp, AlertTriangle, Calendar, RotateCcw } from 'lucide-react';

export const DailyNotePlanSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [nextVisitProgression, setNextVisitProgression] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [willCommunicate, setWillCommunicate] = useState(false);
  const [communicationDetails, setCommunicationDetails] = useState('');

  // Mock dates - in real app these would be calculated
  const progressReportDue = '01/26/26';
  const reEvaluationDue = '04/15/26';
  const daysUntilProgress = 3; // Mock
  const daysUntilReEval = 45; // Mock

  return (
    <Card className="p-5 mb-4">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <h3 className="text-h3 text-gray-900">Plan</h3>
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
          {/* Next Visit Progression */}
          <div>
            <label className="block text-body-sm font-medium text-gray-700 mb-2">
              Next Visit Progression
            </label>
            <textarea
              rows={4}
              value={nextVisitProgression}
              onChange={(e) => setNextVisitProgression(e.target.value)}
              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
              placeholder="❌ BAD: Continue POC&#10;&#10;✅ GOOD: Increase kettlebell weight to 25lbs for deadlifts. Progress to single-leg stance balance exercises. Add overhead reaching exercises with 2lb weights. Continue manual therapy for capsular restriction."
            />
          </div>

          {/* Frequency & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm font-medium text-gray-700 mb-2">Frequency</label>
              <Select
                options={[
                  { value: '', label: 'Select...' },
                  { value: '1x/week', label: '1x/week' },
                  { value: '2x/week', label: '2x/week' },
                  { value: '3x/week', label: '3x/week' },
                  { value: '4x/week', label: '4x/week' },
                ]}
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-gray-700 mb-2">Duration</label>
              <Select
                options={[
                  { value: '', label: 'Select...' },
                  { value: '2 weeks', label: '2 weeks' },
                  { value: '4 weeks', label: '4 weeks' },
                  { value: '6 weeks', label: '6 weeks' },
                  { value: '8 weeks', label: '8 weeks' },
                ]}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          {/* Due Dates Info Boxes */}
          <div className="space-y-3">
            {/* Progress Report Due */}
            <div className={`p-4 border rounded-lg ${daysUntilProgress <= 7 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-body-sm font-semibold text-gray-700">
                      📅 Next Progress Report Due: {progressReportDue}
                    </span>
                    {daysUntilProgress <= 7 && (
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-body-xs font-semibold rounded">
                        ⚠️ Due in {daysUntilProgress} days
                      </span>
                    )}
                  </div>
                  <p className="text-body-xs text-gray-600">
                    (Every 10 visits or 30 days)
                  </p>
                </div>
              </div>
            </div>

            {/* Re-evaluation Due */}
            <div className={`p-4 border rounded-lg ${daysUntilReEval <= 30 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-body-sm font-semibold text-gray-700">
                      🔄 Re-evaluation Due: {reEvaluationDue}
                    </span>
                    {daysUntilReEval <= 30 && (
                      <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-body-xs font-semibold rounded">
                        ⚠️ Due in {daysUntilReEval} days
                      </span>
                    )}
                  </div>
                  <p className="text-body-xs text-gray-600">
                    (Every 90 days for Medicare)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Physician Communication */}
          <div className="pt-4 border-t border-cairos-border">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="will-communicate"
                checked={willCommunicate}
                onChange={(e) => setWillCommunicate(e.target.checked)}
                className="w-4 h-4 rounded border-cairos-border text-cairos-primary focus:ring-cairos-primary"
              />
              <label htmlFor="will-communicate" className="text-body-sm font-medium text-gray-700 cursor-pointer">
                Will communicate with referring physician
              </label>
            </div>
            {willCommunicate && (
              <div>
                <label className="block text-body-sm font-medium text-gray-700 mb-2">
                  What will be communicated?
                </label>
                <textarea
                  rows={3}
                  value={communicationDetails}
                  onChange={(e) => setCommunicationDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                  placeholder="Document what will be communicated to the referring physician..."
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
