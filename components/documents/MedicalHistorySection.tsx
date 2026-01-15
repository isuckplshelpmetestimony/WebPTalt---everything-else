'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { DataTable, TableColumn, TableRow } from './DataTable';
import { Mic } from 'lucide-react';

export interface SurgeryEntry extends TableRow {
  surgery: string;
  date: string;
  outcome: string;
  status: string;
}

export interface MedicalCondition extends TableRow {
  medicalCondition: string;
  onset: string;
  currentStatus: string;
  precaution: string;
  contraindication: string;
}

export interface Medication extends TableRow {
  medication: string;
  dosage: string;
  frequency: string;
  routeOfAdministration: string;
}

interface MedicalHistorySectionProps {
  sectionId: string;
  isRecording: boolean;
  isProcessing: boolean;
  isMicModeEnabled?: boolean;
  onMicClick: () => void;
  micModePrompts?: React.ReactNode;
  surgeryHistory: SurgeryEntry[];
  medicalConditions: MedicalCondition[];
  medications: Medication[];
  onSurgeryHistoryChange: (surgeries: SurgeryEntry[]) => void;
  onMedicalConditionsChange: (conditions: MedicalCondition[]) => void;
  onMedicationsChange: (medications: Medication[]) => void;
}

const surgeryOptions = [
  { value: 'Knee Replacement Surgery', label: 'Knee Replacement Surgery' },
  { value: 'Shoulder Surgery', label: 'Shoulder Surgery' },
  { value: 'Hip Replacement Surgery', label: 'Hip Replacement Surgery' },
  { value: 'Cardiac Surgery', label: 'Cardiac Surgery' },
  { value: 'GI Surgery', label: 'GI Surgery' },
  { value: 'Head or Neck Surgery', label: 'Head or Neck Surgery' },
  { value: 'Lumbar Fusion', label: 'Lumbar Fusion' },
  { value: 'Spinal Surgery', label: 'Spinal Surgery' },
];

const outcomeOptions = [
  { value: 'Improved', label: 'Improved' },
  { value: 'Discharged', label: 'Discharged' },
  { value: 'No Change', label: 'No Change' },
  { value: 'Complications', label: 'Complications' },
];

const statusOptions = [
  { value: 'Discharged', label: 'Discharged' },
  { value: 'Under MD Care', label: 'Under MD Care' },
  { value: 'Active', label: 'Active' },
];

const medicalConditionOptions = [
  { value: 'Hypertension', label: 'Hypertension' },
  { value: 'Diabetes', label: 'Diabetes' },
  { value: 'Cardiac Disease', label: 'Cardiac Disease' },
  { value: 'Respiratory Disease', label: 'Respiratory Disease' },
  { value: 'Neurological Condition', label: 'Neurological Condition' },
  { value: 'Cancer', label: 'Cancer' },
  { value: 'Arthritis', label: 'Arthritis' },
  { value: 'Osteoporosis', label: 'Osteoporosis' },
];

const currentStatusOptions = [
  { value: 'controlled', label: 'Controlled' },
  { value: 'uncontrolled', label: 'Uncontrolled' },
  { value: 'under-md-care', label: 'Under MD care' },
  { value: 'discharged-from-care', label: 'Discharged from care' },
];

const onsetOptions = [
  { value: 'Last 5 years', label: 'Last 5 years' },
  { value: 'Last 10 years', label: 'Last 10 years' },
  { value: 'Childhood', label: 'Childhood' },
  { value: 'No Specific Onset', label: 'No Specific Onset' },
];

const precautionOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

const contraindicationOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'Cardiac', label: 'Cardiac' },
  { value: 'Cancer', label: 'Cancer' },
];

const medicationOptions = [
  { value: 'Hypertension medication', label: 'Hypertension medication' },
  { value: 'Insulin', label: 'Insulin' },
  { value: 'Blood Thinner', label: 'Blood Thinner' },
  { value: 'Pain Medication', label: 'Pain Medication' },
  { value: 'Anti-inflammatory', label: 'Anti-inflammatory' },
];

const frequencyOptions = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Twice Daily', label: 'Twice Daily' },
  { value: 'As Needed', label: 'As Needed' },
  { value: 'Weekly', label: 'Weekly' },
];

const routeOptions = [
  { value: 'Oral', label: 'Oral' },
  { value: 'Injection', label: 'Injection' },
  { value: 'Topical', label: 'Topical' },
  { value: 'IV', label: 'IV' },
];

export const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  sectionId,
  isRecording,
  isProcessing,
  isMicModeEnabled = false,
  onMicClick,
  micModePrompts,
  surgeryHistory,
  medicalConditions,
  medications,
  onSurgeryHistoryChange,
  onMedicalConditionsChange,
  onMedicationsChange,
}) => {
  const surgeryColumns: TableColumn[] = [
    {
      key: 'surgery',
      label: 'Surgery',
      type: 'text',
      placeholder: 'e.g., knee surgery, knee replacement',
    },
    {
      key: 'date',
      label: 'Date',
      type: 'date',
    },
    {
      key: 'outcome',
      label: 'Outcome',
      type: 'text',
      placeholder: 'e.g., healed, completed, for different issue',
    },
    {
      key: 'status',
      label: 'Status',
      type: 'text',
      placeholder: 'e.g., discharged, under MD care, active',
    },
  ];

  const medicalConditionColumns: TableColumn[] = [
    {
      key: 'medicalCondition',
      label: 'Medical Condition',
      type: 'text',
      placeholder: 'e.g., high blood pressure, hypertension, diabetes',
    },
    {
      key: 'onset',
      label: 'Onset',
      type: 'text',
      placeholder: 'e.g., last 5 years, childhood, 10 years ago',
    },
    {
      key: 'currentStatus',
      label: 'Current Status',
      type: 'text',
      placeholder: 'e.g., controlled, uncontrolled, under MD care',
    },
    {
      key: 'precaution',
      label: 'Precaution',
      type: 'text',
      placeholder: 'e.g., yes, no, or specific precautions',
    },
    {
      key: 'contraindication',
      label: 'Contraindication',
      type: 'text',
      placeholder: 'e.g., yes, no, cardiac, cancer',
    },
  ];

  const medicationColumns: TableColumn[] = [
    {
      key: 'medication',
      label: 'Medication',
      type: 'text',
      placeholder: 'e.g., Lisinopril, Ibuprofen, muscle relaxers',
    },
    {
      key: 'dosage',
      label: 'Dosage',
      type: 'text',
      placeholder: 'e.g., 10mg, 500mg',
    },
    {
      key: 'frequency',
      label: 'Frequency',
      type: 'text',
      placeholder: 'e.g., once a day, 2 or 3 times a day, daily',
    },
    {
      key: 'routeOfAdministration',
      label: 'Route Of Administration',
      type: 'text',
      placeholder: 'e.g., oral, by mouth, injection, topical',
    },
  ];

  const handleAddSurgery = () => {
    const newSurgery: SurgeryEntry = {
      id: Date.now().toString(),
      surgery: '',
      date: '',
      outcome: '',
      status: '',
    };
    onSurgeryHistoryChange([...surgeryHistory, newSurgery]);
  };

  const handleUpdateSurgery = (id: string, updates: Partial<SurgeryEntry>) => {
    onSurgeryHistoryChange(
      surgeryHistory.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  };

  const handleDeleteSurgery = (id: string) => {
    onSurgeryHistoryChange(surgeryHistory.filter(s => s.id !== id));
  };

  const handleAddCondition = () => {
    const newCondition: MedicalCondition = {
      id: Date.now().toString(),
      medicalCondition: '',
      onset: '',
      currentStatus: '',
      precaution: '',
      contraindication: '',
    };
    onMedicalConditionsChange([...medicalConditions, newCondition]);
  };

  const handleUpdateCondition = (id: string, updates: Partial<MedicalCondition>) => {
    onMedicalConditionsChange(
      medicalConditions.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  };

  const handleDeleteCondition = (id: string) => {
    onMedicalConditionsChange(medicalConditions.filter(c => c.id !== id));
  };

  const handleAddMedication = () => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      medication: '',
      dosage: '',
      frequency: '',
      routeOfAdministration: '',
    };
    onMedicationsChange([...medications, newMedication]);
  };

  const handleUpdateMedication = (id: string, updates: Partial<Medication>) => {
    onMedicationsChange(
      medications.map(m => m.id === id ? { ...m, ...updates } : m)
    );
  };

  const handleDeleteMedication = (id: string) => {
    onMedicationsChange(medications.filter(m => m.id !== id));
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-h3 text-gray-900">Medical History</h3>
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
            key={`surgeries-${surgeryHistory.length}-${surgeryHistory.map(s => s.id).join('-')}`}
            title="Surgery History"
            columns={surgeryColumns}
            rows={surgeryHistory}
            onAddRow={handleAddSurgery}
            onUpdateRow={handleUpdateSurgery}
            onDeleteRow={handleDeleteSurgery}
          />

          <DataTable
            key={`conditions-${medicalConditions.length}-${medicalConditions.map(c => c.id).join('-')}`}
            title="Medical Conditions"
            columns={medicalConditionColumns}
            rows={medicalConditions}
            onAddRow={handleAddCondition}
            onUpdateRow={handleUpdateCondition}
            onDeleteRow={handleDeleteCondition}
          />

          <DataTable
            key={`medications-${medications.length}-${medications.map(m => m.id).join('-')}`}
            title="Medication History"
            columns={medicationColumns}
            rows={medications}
            onAddRow={handleAddMedication}
            onUpdateRow={handleUpdateMedication}
            onDeleteRow={handleDeleteMedication}
          />
        </div>
      )}
    </Card>
  );
};





