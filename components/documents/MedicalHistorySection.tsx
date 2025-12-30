'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { DataTable, TableColumn, TableRow } from './DataTable';

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
      type: 'select',
      options: surgeryOptions,
      searchable: true,
    },
    {
      key: 'date',
      label: 'Date',
      type: 'date',
    },
    {
      key: 'outcome',
      label: 'Outcome',
      type: 'select',
      options: outcomeOptions,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: statusOptions,
    },
  ];

  const medicalConditionColumns: TableColumn[] = [
    {
      key: 'medicalCondition',
      label: 'Medical Condition',
      type: 'select',
      options: medicalConditionOptions,
      searchable: true,
    },
    {
      key: 'onset',
      label: 'Onset',
      type: 'select',
      options: onsetOptions,
    },
    {
      key: 'currentStatus',
      label: 'Current Status',
      type: 'select',
      options: currentStatusOptions,
    },
    {
      key: 'precaution',
      label: 'Precaution',
      type: 'select',
      options: precautionOptions,
    },
    {
      key: 'contraindication',
      label: 'Contraindication',
      type: 'select',
      options: contraindicationOptions,
    },
  ];

  const medicationColumns: TableColumn[] = [
    {
      key: 'medication',
      label: 'Medication',
      type: 'select',
      options: medicationOptions,
      searchable: true,
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
      type: 'select',
      options: frequencyOptions,
    },
    {
      key: 'routeOfAdministration',
      label: 'Route Of Administration',
      type: 'select',
      options: routeOptions,
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
      <h3 className="text-h3 text-gray-900 mb-4">Medical History</h3>
      <div className="space-y-6">
        <DataTable
          title="Surgery History"
          columns={surgeryColumns}
          rows={surgeryHistory}
          onAddRow={handleAddSurgery}
          onUpdateRow={handleUpdateSurgery}
          onDeleteRow={handleDeleteSurgery}
        />

        <DataTable
          title="Medical Conditions"
          columns={medicalConditionColumns}
          rows={medicalConditions}
          onAddRow={handleAddCondition}
          onUpdateRow={handleUpdateCondition}
          onDeleteRow={handleDeleteCondition}
        />

        <DataTable
          title="Medication History"
          columns={medicationColumns}
          rows={medications}
          onAddRow={handleAddMedication}
          onUpdateRow={handleUpdateMedication}
          onDeleteRow={handleDeleteMedication}
        />
      </div>
    </Card>
  );
};



