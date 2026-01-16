'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ChevronDown, ChevronUp, Plus, Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export const DailyNoteObjectiveSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [observationExpanded, setObservationExpanded] = useState(true);
  const [romExpanded, setRomExpanded] = useState(true);
  const [strengthExpanded, setStrengthExpanded] = useState(true);
  const [functionalExpanded, setFunctionalExpanded] = useState(true);
  const [treatmentsExpanded, setTreatmentsExpanded] = useState(true);
  const [responseExpanded, setResponseExpanded] = useState(true);

  // State for ROM entries - with example data
  const [romEntries, setRomEntries] = useState<Array<{
    id: string;
    motion: string;
    right: string;
    left: string;
    previousRight?: string;
    previousLeft?: string;
  }>>([
    {
      id: '1',
      motion: 'shoulder-flexion',
      right: '125',
      left: '120',
      previousRight: '115',
      previousLeft: '115',
    },
    {
      id: '2',
      motion: 'knee-flexion',
      right: '135',
      left: '',
      previousRight: '140',
      previousLeft: '',
    },
  ]);

  // State for strength entries - with example data
  const [strengthEntries, setStrengthEntries] = useState<Array<{
    id: string;
    muscle: string;
    right: string;
    left: string;
    previousRight?: string;
    previousLeft?: string;
  }>>([
    {
      id: '1',
      muscle: 'quadriceps',
      right: '4/5',
      left: '4/5',
      previousRight: '3+/5',
      previousLeft: '',
    },
  ]);

  // State for functional tests - with example data
  const [functionalTests, setFunctionalTests] = useState<Array<{
    id: string;
    testName: string;
    result: string;
    unit: string;
    previousResult?: string;
  }>>([
    {
      id: '1',
      testName: 'sit-stand',
      result: '12',
      unit: 'seconds',
      previousResult: '14.5 sec',
    },
  ]);

  // State for treatments - with example data
  const [treatments, setTreatments] = useState<Array<{
    id: string;
    cptCode: string;
    time: string;
    description: string;
    sets: string;
    reps: string;
    resistance: string;
    assistance: string;
  }>>([
    {
      id: '1',
      cptCode: '97110',
      time: '25',
      description: '',
      sets: '3',
      reps: '10',
      resistance: '20lb kettlebell',
      assistance: 'independent',
    },
    {
      id: '2',
      cptCode: '97140',
      time: '15',
      description: '',
      sets: '',
      reps: '',
      resistance: '',
      assistance: '',
    },
  ]);

  const addROM = () => {
    setRomEntries([...romEntries, {
      id: Date.now().toString(),
      motion: '',
      right: '',
      left: '',
    }]);
  };

  const addStrength = () => {
    setStrengthEntries([...strengthEntries, {
      id: Date.now().toString(),
      muscle: '',
      right: '',
      left: '',
    }]);
  };

  const addFunctionalTest = () => {
    setFunctionalTests([...functionalTests, {
      id: Date.now().toString(),
      testName: '',
      result: '',
      unit: '',
    }]);
  };

  const addTreatment = () => {
    setTreatments([...treatments, {
      id: Date.now().toString(),
      cptCode: '',
      time: '',
      description: '',
      sets: '',
      reps: '',
      resistance: '',
      assistance: '',
    }]);
  };

  const calculateChange = (current: string, previous?: string): { text: string; percent?: string } => {
    if (!previous || !current) return { text: '' };
    const curr = parseFloat(current);
    const prev = parseFloat(previous);
    if (isNaN(curr) || isNaN(prev)) return { text: '' };
    const diff = curr - prev;
    const percent = ((diff / prev) * 100).toFixed(1);
    const text = diff > 0 ? `+${diff}°` : `${diff}°`;
    return { text, percent };
  };

  // Calculate 8-minute rule
  const calculateEightMinuteRule = () => {
    const performedTreatments = treatments.filter(t => t.cptCode && t.time);
    const totalMinutes = performedTreatments.reduce((sum, t) => sum + (parseFloat(t.time) || 0), 0);
    
    // 8-minute rule: 8-22 min = 1 unit, 23-37 = 2 units, 38-52 = 3 units, etc.
    let totalUnits = 0;
    performedTreatments.forEach(treatment => {
      const minutes = parseFloat(treatment.time) || 0;
      if (minutes >= 8) {
        if (minutes <= 22) {
          totalUnits += 1;
        } else {
          totalUnits += 1 + Math.floor((minutes - 22) / 15);
        }
      }
    });
    
    return { 
      totalMinutes, 
      units: totalUnits, 
      isCompliant: totalMinutes >= 8 && totalUnits > 0 
    };
  };

  const eightMinuteRule = calculateEightMinuteRule();

  return (
    <Card className="p-5 mb-4">
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 flex-1 text-left"
        >
          <h3 className="text-h3 text-gray-900">Objective</h3>
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
          {/* 2A. Observation */}
          <div className="border border-cairos-border rounded-xl p-4">
            <button
              onClick={() => setObservationExpanded(!observationExpanded)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h4 className="text-body-sm font-semibold text-gray-700">2A. Observation</h4>
              {observationExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {observationExpanded && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-xs font-medium text-gray-700 mb-1">Posture</label>
                    <Select
                      options={[
                        { value: '', label: 'Select...' },
                        { value: 'normal', label: 'Normal alignment' },
                        { value: 'forward-head', label: 'Forward head' },
                        { value: 'kyphotic', label: 'Kyphotic' },
                        { value: 'lordotic', label: 'Lordotic' },
                        { value: 'scoliotic', label: 'Scoliotic' },
                        { value: 'custom', label: 'Custom' },
                      ]}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                  <div>
                    <label className="block text-body-xs font-medium text-gray-700 mb-1">Gait Pattern</label>
                    <Select
                      options={[
                        { value: '', label: 'Select...' },
                        { value: 'normal', label: 'Normal' },
                        { value: 'antalgic', label: 'Antalgic' },
                        { value: 'trendelenburg', label: 'Trendelenburg' },
                        { value: 'ataxic', label: 'Ataxic' },
                        { value: 'steppage', label: 'Steppage' },
                        { value: 'custom', label: 'Custom' },
                      ]}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-body-xs font-medium text-gray-700 mb-1">Additional Posture Notes</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                    placeholder="Additional posture observations..."
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-medium text-gray-700 mb-1">Gait Observations</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                    placeholder="Gait pattern observations..."
                  />
                </div>
                <div>
                  <label className="block text-body-xs font-medium text-gray-700 mb-1">Palpation Findings</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                    placeholder="Document tenderness, muscle tone, swelling..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-body-xs font-medium text-gray-700 mb-1">Assistive Device</label>
                    <Select
                      options={[
                        { value: '', label: 'Select...' },
                        { value: 'none', label: 'None' },
                        { value: 'cane', label: 'Cane' },
                        { value: 'walker', label: 'Walker' },
                        { value: 'crutches', label: 'Crutches' },
                        { value: 'wheelchair', label: 'Wheelchair' },
                      ]}
                      value=""
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-body-xs font-medium text-gray-700 mb-1">Left/Right Symmetry</label>
                  <textarea
                    rows={2}
                    className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                    placeholder="Document symmetry observations..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2B. Range of Motion */}
          <div className="border border-cairos-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-body-sm font-semibold text-gray-700">2B. Range of Motion</h4>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addROM}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add ROM Measurement
              </Button>
            </div>

            {romEntries.length > 0 && (
              <div className="overflow-x-auto border border-cairos-border rounded-lg">
                <table className="w-full text-body-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-cairos-border">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Motion</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Right (degrees)</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Left (degrees)</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Previous R</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Previous L</th>
                      <th className="text-right py-2 px-3 font-semibold text-gray-700">Change</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {romEntries.map((entry) => {
                      const changeRight = calculateChange(entry.right, entry.previousRight);
                      const changeLeft = calculateChange(entry.left, entry.previousLeft);
                      return (
                        <tr key={entry.id} className="border-b border-cairos-border">
                          <td className="py-2 px-3">
                            <Select
                              options={[
                                { value: '', label: 'Select...' },
                                { value: 'shoulder-flexion', label: 'Shoulder Flexion' },
                                { value: 'shoulder-abduction', label: 'Shoulder Abduction' },
                                { value: 'hip-flexion', label: 'Hip Flexion' },
                                { value: 'knee-flexion', label: 'Knee Flexion' },
                                { value: 'ankle-dorsiflexion', label: 'Ankle Dorsiflexion' },
                                { value: 'cervical-flexion', label: 'Cervical Flexion' },
                                { value: 'lumbar-flexion', label: 'Lumbar Flexion' },
                              ]}
                              value={entry.motion}
                              onChange={() => {}}
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={entry.right}
                              onChange={() => {}}
                              className="w-20 text-right"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={entry.left}
                              onChange={() => {}}
                              className="w-20 text-right"
                            />
                          </td>
                          <td className="py-2 px-3 text-right text-gray-400 bg-gray-50">
                            {entry.previousRight ? `${entry.previousRight}°` : '—'}
                          </td>
                          <td className="py-2 px-3 text-right text-gray-400 bg-gray-50">
                            {entry.previousLeft ? `${entry.previousLeft}°` : '—'}
                          </td>
                          <td className="py-2 px-3 text-right">
                            {changeRight.text && (
                              <span className={changeRight.text.startsWith('+') ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                {changeRight.text}{changeRight.percent && ` (${changeRight.percent}%)`}
                              </span>
                            )}
                            {changeLeft.text && (
                              <span className={`ml-2 ${changeLeft.text.startsWith('+') ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}`}>
                                {changeLeft.text}{changeLeft.percent && ` (${changeLeft.percent}%)`}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => setRomEntries(romEntries.filter(e => e.id !== entry.id))}
                              className="p-1 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 2C. Strength Testing */}
          <div className="border border-cairos-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-body-sm font-semibold text-gray-700">2C. Strength Testing</h4>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addStrength}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Strength Test
              </Button>
            </div>

            {strengthEntries.length > 0 && (
              <div className="overflow-x-auto border border-cairos-border rounded-lg">
                <table className="w-full text-body-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-cairos-border">
                      <th className="text-left py-2 px-3 font-semibold text-gray-700">Muscle/Movement</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Right</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Left</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Previous R</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Previous L</th>
                      <th className="text-center py-2 px-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {strengthEntries.map((entry) => (
                      <tr key={entry.id} className="border-b border-cairos-border">
                        <td className="py-2 px-3">
                          <Select
                            options={[
                              { value: '', label: 'Select...' },
                              { value: 'shoulder-flexors', label: 'Shoulder Flexors' },
                              { value: 'hip-extensors', label: 'Hip Extensors' },
                              { value: 'quadriceps', label: 'Quadriceps' },
                              { value: 'hamstrings', label: 'Hamstrings' },
                              { value: 'gastrocnemius', label: 'Gastrocnemius' },
                            ]}
                            value={entry.muscle}
                            onChange={() => {}}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Select
                            options={[
                              { value: '', label: 'Select...' },
                              { value: '0/5', label: '0/5' },
                              { value: '1/5', label: '1/5' },
                              { value: '2-/5', label: '2-/5' },
                              { value: '2/5', label: '2/5' },
                              { value: '2+/5', label: '2+/5' },
                              { value: '3-/5', label: '3-/5' },
                              { value: '3/5', label: '3/5' },
                              { value: '3+/5', label: '3+/5' },
                              { value: '4-/5', label: '4-/5' },
                              { value: '4/5', label: '4/5' },
                              { value: '4+/5', label: '4+/5' },
                              { value: '5/5', label: '5/5' },
                            ]}
                            value={entry.right}
                            onChange={() => {}}
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Select
                            options={[
                              { value: '', label: 'Select...' },
                              { value: '0/5', label: '0/5' },
                              { value: '1/5', label: '1/5' },
                              { value: '2-/5', label: '2-/5' },
                              { value: '2/5', label: '2/5' },
                              { value: '2+/5', label: '2+/5' },
                              { value: '3-/5', label: '3-/5' },
                              { value: '3/5', label: '3/5' },
                              { value: '3+/5', label: '3+/5' },
                              { value: '4-/5', label: '4-/5' },
                              { value: '4/5', label: '4/5' },
                              { value: '4+/5', label: '4+/5' },
                              { value: '5/5', label: '5/5' },
                            ]}
                            value={entry.left}
                            onChange={() => {}}
                          />
                        </td>
                        <td className="py-2 px-3 text-center text-gray-400 bg-gray-50">
                          {entry.previousRight || '—'}
                        </td>
                        <td className="py-2 px-3 text-center text-gray-400 bg-gray-50">
                          {entry.previousLeft || '—'}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setStrengthEntries(strengthEntries.filter(e => e.id !== entry.id))}
                            className="p-1 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 2D. Functional Tests */}
          <div className="border border-cairos-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-body-sm font-semibold text-gray-700">2D. Functional Tests</h4>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addFunctionalTest}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Functional Test
              </Button>
            </div>

            {functionalTests.length > 0 && (
              <div className="space-y-3">
                {functionalTests.map((test) => (
                  <div key={test.id} className="border border-cairos-border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Test Name</label>
                        <Select
                          options={[
                            { value: '', label: 'Select...' },
                            { value: 'sit-stand', label: '5x Sit-to-Stand' },
                            { value: 'tug', label: 'TUG (Timed Up and Go)' },
                            { value: '6min-walk', label: '6-Minute Walk Test' },
                            { value: 'gait-speed', label: 'Gait Speed Test' },
                            { value: 'lefs', label: 'LEFS (Lower Extremity)' },
                            { value: 'ndi', label: 'NDI (Neck Disability)' },
                          ]}
                          value={test.testName}
                          onChange={() => {}}
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Result</label>
                        <Input
                          type="number"
                          value={test.result}
                          onChange={() => {}}
                          placeholder="Result"
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Unit</label>
                        <Select
                          options={[
                            { value: '', label: 'Select...' },
                            { value: 'seconds', label: 'seconds' },
                            { value: 'minutes', label: 'minutes' },
                            { value: 'feet', label: 'feet' },
                            { value: 'points', label: 'points' },
                          ]}
                          value={test.unit}
                          onChange={() => {}}
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Previous Result</label>
                        <Input
                          type="text"
                          value={test.previousResult || ''}
                          onChange={() => {}}
                          placeholder="N/A"
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-body-xs text-blue-800">
                        <strong>Normative:</strong> Age 60-69: 11.4 seconds
                      </p>
                    </div>
                    {test.previousResult && (
                      <div className="mt-2 text-body-xs">
                        <span className="text-gray-600">Previous: {test.previousResult}</span>
                        {test.previousResult && test.result && (
                          <span className="ml-2 text-green-600 font-semibold">
                            Change: -2.5 sec ✓
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => setFunctionalTests(functionalTests.filter(t => t.id !== test.id))}
                      className="mt-2 text-body-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2E. Treatments Performed - MOST IMPORTANT */}
          <div className="border-2 border-yellow-300 rounded-xl p-4 bg-yellow-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-body-sm font-semibold text-gray-700">2E. Treatments Performed</h4>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addTreatment}
                className="flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Treatment
              </Button>
            </div>

            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-body-xs text-red-800">
                  ⚠️ Document EXACT minutes for each CPT code for 8-Minute Rule compliance
                </p>
              </div>
            </div>

            {treatments.length > 0 && (
              <div className="space-y-4 mb-4">
                {treatments.map((treatment) => (
                  <div key={treatment.id} className="border border-cairos-border rounded-lg p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">CPT Code</label>
                        <Select
                          options={[
                            { value: '', label: 'Select...' },
                            { value: '97110', label: '97110 - Therapeutic Exercise' },
                            { value: '97112', label: '97112 - Neuromuscular Re-education' },
                            { value: '97140', label: '97140 - Manual Therapy' },
                            { value: '97530', label: '97530 - Therapeutic Activities' },
                          ]}
                          value={treatment.cptCode}
                          onChange={() => {}}
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Time (minutes)</label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={treatment.time}
                            onChange={() => {}}
                            placeholder="25"
                            className="flex-1"
                          />
                          <span className="text-body-xs text-gray-500">min</span>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-body-xs font-medium text-gray-700 mb-1">Detailed Description</label>
                      <textarea
                        rows={5}
                        value={treatment.description}
                        onChange={() => {}}
                        className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
                        placeholder="✅ GOOD: Therapeutic Exercise (97110): Squat progression 3x10 with 20lb kettlebell. Patient required tactile facilitation to maintain neutral spine during descent, preventing pelvic tilt. Skilled cueing necessary to ensure proper motor recruitment for lumbar stabilization.&#10;&#10;❌ BAD: Patient performed squats 3x10. Tolerated well."
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Sets</label>
                        <Input
                          type="number"
                          value={treatment.sets}
                          onChange={() => {}}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Reps</label>
                        <Input
                          type="number"
                          value={treatment.reps}
                          onChange={() => {}}
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Resistance</label>
                        <Input
                          type="text"
                          value={treatment.resistance}
                          onChange={() => {}}
                          placeholder="20lb kettlebell"
                        />
                      </div>
                      <div>
                        <label className="block text-body-xs font-medium text-gray-700 mb-1">Assistance Level</label>
                        <Select
                          options={[
                            { value: '', label: 'Select...' },
                            { value: 'independent', label: 'Independent' },
                            { value: 'min-assist', label: 'Min Assist' },
                            { value: 'mod-assist', label: 'Mod Assist' },
                            { value: 'max-assist', label: 'Max Assist' },
                            { value: 'dependent', label: 'Dependent' },
                          ]}
                          value={treatment.assistance}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => setTreatments(treatments.filter(t => t.id !== treatment.id))}
                      className="mt-3 text-body-xs text-red-600 hover:text-red-700"
                    >
                      Remove Treatment
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 8-Minute Rule Calculator */}
            {treatments.length > 0 && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="text-body-sm font-semibold text-gray-700 mb-3">8-Minute Rule Calculator</h5>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-body-xs">
                    <thead>
                      <tr className="bg-white border-b border-blue-300">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">CPT Code</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-700">Time</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-700">Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treatments.filter(t => t.cptCode && t.time).map((treatment) => {
                        const minutes = parseFloat(treatment.time) || 0;
                        let units = 0;
                        if (minutes >= 8) {
                          if (minutes <= 22) units = 1;
                          else units = 1 + Math.floor((minutes - 22) / 15);
                        }
                        return (
                          <tr key={treatment.id} className="border-b border-blue-200">
                            <td className="py-2 px-3">{treatment.cptCode}</td>
                            <td className="py-2 px-3 text-right">{minutes} min</td>
                            <td className="py-2 px-3 text-right font-semibold">{units}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-white font-semibold">
                        <td className="py-2 px-3">Total</td>
                        <td className="py-2 px-3 text-right">{eightMinuteRule.totalMinutes} min</td>
                        <td className="py-2 px-3 text-right">{eightMinuteRule.units} units</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div className="flex items-center gap-2">
                  {eightMinuteRule.isCompliant ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-body-xs font-semibold text-green-700">✅ COMPLIANT</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="text-body-xs font-semibold text-red-700">❌ NON-COMPLIANT</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2F. Patient Response */}
          <div className="border border-cairos-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-body-sm font-semibold text-gray-700">2F. Patient Response to Treatment</h4>
            </div>
            <textarea
              rows={4}
              value="Patient reports decreased pain during overhead reaching activities. Noted improved ease of movement during therapeutic exercise. Patient able to complete full sets without rest breaks, which was not possible last visit."
              onChange={() => {}}
              className="w-full px-3 py-2 border border-cairos-border rounded-lg text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
              placeholder="Document pain changes, movement improvements, feedback..."
            />
          </div>
        </div>
      )}
    </Card>
  );
};
