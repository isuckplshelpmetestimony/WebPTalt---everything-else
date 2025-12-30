'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { DataTable, TableColumn, TableRow } from './DataTable';

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
      type: 'select',
      options: activityTimeOptions,
      searchable: true,
    },
    {
      key: 'symptoms',
      label: 'Symptoms',
      type: 'select',
      options: symptomsOptions,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'select',
      options: descriptionOptions,
      searchable: true,
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
      <h3 className="text-h3 text-gray-900 mb-4">Pain History</h3>
      <div className="space-y-6">
        <DataTable
          title="Pain Area"
          columns={painAreaColumns}
          rows={painAreas}
          onAddRow={handleAddPainArea}
          onUpdateRow={handleUpdatePainArea}
          onDeleteRow={handleDeletePainArea}
        />

        <DataTable
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
    </Card>
  );
};



