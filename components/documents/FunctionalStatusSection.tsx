'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { DataTable, TableColumn, TableRow } from './DataTable';
import { Input } from '../ui/Input';
import { Mic } from 'lucide-react';

export interface FunctionalActivity extends TableRow {
  functionalActivity: string;
  status: string;
  assistance: string;
  patientGoal: boolean;
  level: string;
}

interface FunctionalStatusSectionProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  activities: FunctionalActivity[];
  restrictions: string;
  lastDateWorked: string;
  comments: string;
  onActivitiesChange: (activities: FunctionalActivity[]) => void;
  onRestrictionsChange: (restrictions: string) => void;
  onLastDateWorkedChange: (date: string) => void;
  onCommentsChange: (comments: string) => void;
}

const functionalActivityOptions = [
  { value: 'Walk', label: 'Walk' },
  { value: 'Stairs', label: 'Stairs' },
  { value: 'Running', label: 'Running' },
  { value: 'Sit to stand', label: 'Sit to stand' },
  { value: 'Sitting', label: 'Sitting' },
  { value: 'Squats', label: 'Squats' },
  { value: 'Currently Working', label: 'Currently Working' },
];

const statusOptions = [
  { value: 'Unable to Perform', label: 'Unable to Perform' },
  { value: 'Moderate Limitation', label: 'Moderate Limitation' },
  { value: 'Moderate to Severe Limitation', label: 'Moderate to Severe Limitation' },
  { value: 'Mild Limitation', label: 'Mild Limitation' },
  { value: 'No Limitation', label: 'No Limitation' },
];

const levelOptions = [
  { value: 'Current', label: 'Current' },
  { value: 'Goal', label: 'Goal' },
];

export const FunctionalStatusSection: React.FC<FunctionalStatusSectionProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  activities,
  restrictions,
  lastDateWorked,
  comments,
  onActivitiesChange,
  onRestrictionsChange,
  onLastDateWorkedChange,
  onCommentsChange,
}) => {
  const functionalActivityColumns: TableColumn[] = [
    {
      key: 'functionalActivity',
      label: 'Functional Activity',
      type: 'text',
      placeholder: 'e.g., putting on socks and shoes',
    },
    {
      key: 'status',
      label: 'Status / Difficulty',
      type: 'text',
      placeholder: 'e.g., having trouble, can\'t bend down',
    },
    {
      key: 'assistance',
      label: 'Assistance',
      type: 'text',
      placeholder: 'e.g., wife helps with...',
    },
    {
      key: 'patientGoal',
      label: 'Patient Goal',
      type: 'checkbox',
      align: 'center',
    },
    {
      key: 'level',
      label: 'Level',
      type: 'select',
      options: levelOptions,
    },
  ];

  const handleAddActivity = () => {
    const newActivity: FunctionalActivity = {
      id: Date.now().toString(),
      functionalActivity: '',
      status: '',
      assistance: '',
      patientGoal: false,
      level: 'Current',
    };
    onActivitiesChange([...activities, newActivity]);
  };

  const handleUpdateActivity = (id: string, updates: Partial<FunctionalActivity>) => {
    onActivitiesChange(
      activities.map(a => a.id === id ? { ...a, ...updates } : a)
    );
  };

  const handleDeleteActivity = (id: string) => {
    onActivitiesChange(activities.filter(a => a.id !== id));
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 text-gray-900">Functional Status</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onMicClick();
            }}
            disabled={isProcessing}
            className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Mic className={`w-5 h-5 ${
                isRecording 
                  ? 'text-red-600 animate-pulse' 
                  : isMicModeEnabled 
                    ? 'text-green-600' 
                    : 'text-gray-400'
              }`} />
            )}
          </button>
          {isRecording && (
            <span className="text-body-sm text-red-600 font-medium">Recording...</span>
          )}
        </div>
      </div>
      {micModePrompts ? (
        <div>
          {micModePrompts}
        </div>
      ) : (
        <div className="space-y-6">
          <DataTable
            key={`functional-activities-${activities.length}-${activities.map(a => a.id).join('-')}`}
            title="Functional Activity"
            columns={functionalActivityColumns}
            rows={activities}
            onAddRow={handleAddActivity}
            onUpdateRow={handleUpdateActivity}
            onDeleteRow={handleDeleteActivity}
          />

          <div className="space-y-2">
            <label className="text-body-sm font-medium text-gray-700">
              Restrictions
            </label>
            <Input
              value={restrictions}
              onChange={(e) => onRestrictionsChange(e.target.value)}
              placeholder="Enter any restrictions"
            />
          </div>

          <div className="space-y-2">
            <label className="text-body-sm font-medium text-gray-700">
              Last Date Worked
            </label>
            <Input
              type="date"
              value={lastDateWorked}
              onChange={(e) => onLastDateWorkedChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-body-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              value={comments}
              onChange={(e) => onCommentsChange(e.target.value)}
              rows={4}
              className="w-full px-2.5 py-1.5 border rounded-md text-body bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary focus:border-transparent border-cairos-border"
            />
          </div>
        </div>
      )}
    </Card>
  );
};





