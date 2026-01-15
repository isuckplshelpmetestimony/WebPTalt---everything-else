'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { DataTable, TableColumn, TableRow } from './DataTable';
import { Mic } from 'lucide-react';

export interface PainArea extends TableRow {
  area: string;
  current: string;
  best: string;
  worst: string;
}

export interface PainDescription extends TableRow {
  area: string;
  activityTime: string;
  symptoms: string;
  description: string;
}

interface PainHistorySectionProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  painAreas: PainArea[];
  painDescriptions: PainDescription[];
  comments: string;
  onPainAreasChange: (areas: PainArea[]) => void;
  onPainDescriptionsChange: (descriptions: PainDescription[]) => void;
  onCommentsChange: (comments: string) => void;
}

const areaOptions = [
  { value: 'Chest', label: 'Chest' },
  { value: 'Thoracic Spine', label: 'Thoracic Spine' },
  { value: 'Lumbar Spine', label: 'Lumbar Spine' },
  { value: 'Knee', label: 'Knee' },
  { value: 'Shoulder', label: 'Shoulder' },
  { value: 'Hip', label: 'Hip' },
  { value: 'Ankle', label: 'Ankle' },
  { value: 'Elbow', label: 'Elbow' },
  { value: 'Wrist', label: 'Wrist' },
  { value: 'Neck', label: 'Neck' },
];

const activityTimeOptions = [
  { value: 'Bending', label: 'Bending' },
  { value: 'Sitting', label: 'Sitting' },
  { value: 'Walking', label: 'Walking' },
  { value: 'Standing', label: 'Standing' },
  { value: 'Stairs', label: 'Stairs' },
  { value: 'Lifting', label: 'Lifting' },
  { value: 'Reaching', label: 'Reaching' },
  { value: 'Running', label: 'Running' },
];

const symptomsOptions = [
  { value: 'Increased', label: 'Increased' },
  { value: 'Decreased', label: 'Decreased' },
  { value: 'Improved', label: 'Improved' },
  { value: 'No Change', label: 'No Change' },
];

const descriptionOptions = [
  { value: 'Aching', label: 'Aching' },
  { value: 'Dull', label: 'Dull' },
  { value: 'Stiff', label: 'Stiff' },
  { value: 'Unstable', label: 'Unstable' },
  { value: 'Sharp', label: 'Sharp' },
  { value: 'Burning', label: 'Burning' },
  { value: 'Radiates', label: 'Radiates' },
  { value: 'Deep', label: 'Deep' },
  { value: 'Stabbing', label: 'Stabbing' },
];

export const PainHistorySection: React.FC<PainHistorySectionProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  painAreas,
  painDescriptions,
  comments,
  onPainAreasChange,
  onPainDescriptionsChange,
  onCommentsChange,
}) => {
  const painAreaColumns: TableColumn[] = [
    {
      key: 'area',
      label: 'Area',
      type: 'select',
      options: areaOptions,
      searchable: true,
    },
    {
      key: 'current',
      label: 'Current',
      type: 'text',
      placeholder: 'e.g., 4/10',
    },
    {
      key: 'best',
      label: 'Best',
      type: 'text',
      placeholder: 'e.g., 5/10',
    },
    {
      key: 'worst',
      label: 'Worst',
      type: 'text',
      placeholder: 'e.g., 8/10',
    },
  ];

  const painDescriptionColumns: TableColumn[] = [
    {
      key: 'area',
      label: 'Area',
      type: 'select',
      options: areaOptions,
      searchable: true,
    },
    {
      key: 'activityTime',
      label: 'Activity / Time',
      type: 'text',
      placeholder: 'e.g., Sitting for too long, bending over',
    },
    {
      key: 'symptoms',
      label: 'Symptoms',
      type: 'text',
      placeholder: 'e.g., sharp stabbing pain in lower back',
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      placeholder: 'e.g., sharp, stabbing, radiates',
    },
  ];

  const handleAddPainArea = () => {
    const newArea: PainArea = {
      id: Date.now().toString(),
      area: '',
      current: '',
      best: '',
      worst: '',
    };
    onPainAreasChange([...painAreas, newArea]);
  };

  const handleUpdatePainArea = (id: string, updates: Partial<PainArea>) => {
    onPainAreasChange(
      painAreas.map(a => a.id === id ? { ...a, ...updates } : a)
    );
  };

  const handleDeletePainArea = (id: string) => {
    onPainAreasChange(painAreas.filter(a => a.id !== id));
  };

  const handleAddPainDescription = () => {
    const newDescription: PainDescription = {
      id: Date.now().toString(),
      area: '',
      activityTime: '',
      symptoms: '',
      description: '',
    };
    onPainDescriptionsChange([...painDescriptions, newDescription]);
  };

  const handleUpdatePainDescription = (id: string, updates: Partial<PainDescription>) => {
    onPainDescriptionsChange(
      painDescriptions.map(d => d.id === id ? { ...d, ...updates } : d)
    );
  };

  const handleDeletePainDescription = (id: string) => {
    onPainDescriptionsChange(painDescriptions.filter(d => d.id !== id));
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 text-gray-900">Pain History</h3>
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
            key={`pain-areas-${painAreas.length}-${painAreas.map(a => a.id).join('-')}`}
            title="Pain Area"
            columns={painAreaColumns}
            rows={painAreas}
            onAddRow={handleAddPainArea}
            onUpdateRow={handleUpdatePainArea}
            onDeleteRow={handleDeletePainArea}
          />

          <DataTable
            key={`pain-descriptions-${painDescriptions.length}-${painDescriptions.map(d => d.id).join('-')}`}
            title="Pain Description"
            columns={painDescriptionColumns}
            rows={painDescriptions}
            onAddRow={handleAddPainDescription}
            onUpdateRow={handleUpdatePainDescription}
            onDeleteRow={handleDeletePainDescription}
          />

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





