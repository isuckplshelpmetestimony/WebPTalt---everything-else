'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Appointment, Provider } from '@/lib/types/schedule';
import { Patient } from '@/lib/types/patient';
import { format } from 'date-fns';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (appointment: Appointment, newPatient?: Patient) => void;
  existingPatients: Array<{ id: string; name: string }>;
  providers: Provider[];
  selectedDate: Date;
}

type PatientMode = 'existing' | 'new';

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  existingPatients,
  providers,
  selectedDate,
}) => {
  const [patientMode, setPatientMode] = useState<PatientMode>('existing');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [providerId, setProviderId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(format(selectedDate, 'yyyy-MM-dd'));
  const [startHour, setStartHour] = useState('9');
  const [startMinute, setStartMinute] = useState('0');
  const [duration, setDuration] = useState('60');
  const [appointmentType, setAppointmentType] = useState<'Initial' | 'Follow-up' | 'Evaluation'>('Initial');
  const [status, setStatus] = useState<'confirmed' | 'pending' | 'checked-in'>('confirmed');
  
  // New patient fields
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientDob, setNewPatientDob] = useState('');
  const [newPatientGender, setNewPatientGender] = useState('Male');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientStationNumber, setNewPatientStationNumber] = useState('');

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = ['0', '15', '30', '45'];
  const durationOptions = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' },
    { value: '90', label: '90 minutes' },
    { value: '120', label: '120 minutes' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (patientMode === 'existing' && !selectedPatientId) {
      alert('Please select a patient');
      return;
    }

    if (patientMode === 'new') {
      if (!newPatientName.trim() || !newPatientDob || !newPatientPhone.trim()) {
        alert('Please fill in all required patient fields');
        return;
      }
    }

    if (!providerId) {
      alert('Please select a provider');
      return;
    }

    const selectedProvider = providers.find(p => p.id === providerId);
    if (!selectedProvider) return;

    // Create appointment date/time
    const [year, month, day] = appointmentDate.split('-').map(Number);
    const startTime = new Date(year, month - 1, day, parseInt(startHour), parseInt(startMinute));
    const endTime = new Date(startTime.getTime() + parseInt(duration) * 60000);

    let patientId: string;
    let patientName: string;
    let newPatient: Patient | undefined;

    if (patientMode === 'existing') {
      const selectedPatient = existingPatients.find(p => p.id === selectedPatientId);
      if (!selectedPatient) return;
      patientId = selectedPatient.id;
      patientName = selectedPatient.name;
    } else {
      // Create new patient
      const newPatientId = `patient-${Date.now()}`;
      patientId = newPatientId;
      patientName = newPatientName.trim().toUpperCase();
      
      newPatient = {
        id: newPatientId,
        name: patientName,
        dob: new Date(newPatientDob),
        gender: newPatientGender,
        phone: newPatientPhone.trim(),
        email: newPatientEmail.trim() || '',
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
        },
        cases: [],
        insurance: {
          id: '',
          name: '',
          policyNumber: '',
          groupNumber: '',
        },
        diagnosis: '',
        diagnosisCode: '',
        patientType: '',
        arrivalRate: 0,
      };
    }

    // Create appointment
    const appointment: Appointment = {
      id: `appt-${Date.now()}`,
      patientId,
      patientName,
      provider: selectedProvider.name,
      startTime,
      endTime,
      type: appointmentType,
      status,
      duration: parseInt(duration),
    };

    onSchedule(appointment, newPatient);
    
    // Reset form
    setPatientMode('existing');
    setSelectedPatientId('');
    setProviderId('');
    setAppointmentDate(format(selectedDate, 'yyyy-MM-dd'));
    setStartHour('9');
    setStartMinute('0');
    setDuration('60');
    setAppointmentType('Initial');
    setStatus('confirmed');
    setNewPatientName('');
    setNewPatientDob('');
    setNewPatientGender('Male');
    setNewPatientPhone('');
    setNewPatientEmail('');
    setNewPatientStationNumber('');
    
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule Appointment"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Mode Selection */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="patientMode"
              value="existing"
              checked={patientMode === 'existing'}
              onChange={(e) => setPatientMode(e.target.value as PatientMode)}
              className="w-4 h-4"
            />
            <span className="text-body">Existing Patient</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="patientMode"
              value="new"
              checked={patientMode === 'new'}
              onChange={(e) => setPatientMode(e.target.value as PatientMode)}
              className="w-4 h-4"
            />
            <span className="text-body">New Patient</span>
          </label>
        </div>

        {/* Existing Patient Selection */}
        {patientMode === 'existing' && (
          <div>
            <Select
              label="Select Patient"
              options={existingPatients.map(p => ({
                value: p.id,
                label: p.name,
              }))}
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
            />
          </div>
        )}

        {/* New Patient Form */}
        {patientMode === 'new' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-cairos-border">
            <h3 className="text-body font-semibold mb-3">New Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                type="text"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                required
                placeholder="Last Name, First Name"
              />
              <Input
                label="Date of Birth *"
                type="date"
                value={newPatientDob}
                onChange={(e) => setNewPatientDob(e.target.value)}
                required
              />
              <div>
                <Select
                  label="Gender"
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  value={newPatientGender}
                  onChange={(e) => setNewPatientGender(e.target.value)}
                />
              </div>
              <Input
                label="Phone Number *"
                type="tel"
                value={newPatientPhone}
                onChange={(e) => setNewPatientPhone(e.target.value)}
                required
                placeholder="(555) 123-4567"
              />
              <Input
                label="Email"
                type="email"
                value={newPatientEmail}
                onChange={(e) => setNewPatientEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <Input
                label="Station Number"
                type="text"
                value={newPatientStationNumber}
                onChange={(e) => setNewPatientStationNumber(e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        )}

        {/* Appointment Details */}
        <div className="space-y-4 pt-4 border-t border-cairos-border">
          <h3 className="text-body font-semibold mb-3">Appointment Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Provider *"
                options={providers.map(p => ({
                  value: p.id,
                  label: p.name,
                }))}
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                required
              />
            </div>
            
            <Input
              label="Date *"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
            
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  label="Start Hour *"
                  options={hours.map(h => ({
                    value: String(h),
                    label: `${h % 12 || 12} ${h >= 12 ? 'PM' : 'AM'}`,
                  }))}
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Select
                  label="Minute"
                  options={minutes.map(m => ({
                    value: m,
                    label: m.padStart(2, '0'),
                  }))}
                  value={startMinute}
                  onChange={(e) => setStartMinute(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select
                label="Duration"
                options={durationOptions}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            
            <div>
              <Select
                label="Appointment Type"
                options={[
                  { value: 'Initial', label: 'Initial' },
                  { value: 'Follow-up', label: 'Follow-up' },
                  { value: 'Evaluation', label: 'Evaluation' },
                ]}
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as 'Initial' | 'Follow-up' | 'Evaluation')}
              />
            </div>
            
            <div>
              <Select
                label="Status"
                options={[
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'checked-in', label: 'Checked In' },
                ]}
                value={status}
                onChange={(e) => setStatus(e.target.value as 'confirmed' | 'pending' | 'checked-in')}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-cairos-border">
          <Button type="button" variant="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Schedule Appointment
          </Button>
        </div>
      </form>
    </Modal>
  );
};

