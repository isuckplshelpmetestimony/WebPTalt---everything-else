'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Users, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { CalendarSidebar } from '@/components/schedule/CalendarSidebar';
import { ResourcePanel } from '@/components/schedule/ResourcePanel';
import { AppointmentContextMenu } from '@/components/schedule/AppointmentContextMenu';
import { WaitListButton } from '@/components/schedule/WaitListButton';
import { ScheduleAppointmentModal } from '@/components/dashboard/ScheduleAppointmentModal';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Appointment, Provider } from '@/lib/types/schedule';
import { Patient } from '@/lib/types/patient';

// Mock data - replace with actual API calls
const mockProviders: Provider[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'therapist', status: 'available' },
  { id: '2', name: 'Dr. Michael Chen', role: 'therapist', status: 'busy' },
  { id: '3', name: 'Dr. Emily Rodriguez', role: 'therapist', status: 'available' },
];

// Mock patients list - same as patients page
const mockPatients = [
  { id: '1', name: 'ROBERT D MCMULLEN JR' },
  { id: '2', name: 'MIGUEL A PEREZ' },
  { id: '3', name: 'SANCHEZ, REBECCA' },
  { id: '4', name: 'MEJIA, SEGUNDO' },
  { id: '5', name: 'JOHN DOE' },
  { id: '6', name: 'JANE SMITH' },
];

// Initial appointments - using patients from the patients page
const createInitialAppointments = (date: Date): Appointment[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return [
    {
      id: '1',
      patientId: '1',
      patientName: 'ROBERT D MCMULLEN JR',
      provider: 'Dr. Sarah Johnson',
      startTime: new Date(year, month, day, 9, 0),
      endTime: new Date(year, month, day, 10, 0),
      type: 'Initial',
      status: 'confirmed',
      duration: 60,
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'MIGUEL A PEREZ',
      provider: 'Dr. Sarah Johnson',
      startTime: new Date(year, month, day, 10, 30),
      endTime: new Date(year, month, day, 11, 30),
      type: 'Follow-up',
      status: 'pending',
      duration: 60,
    },
    {
      id: '3',
      patientId: '3',
      patientName: 'SANCHEZ, REBECCA',
      provider: 'Dr. Michael Chen',
      startTime: new Date(year, month, day, 14, 0),
      endTime: new Date(year, month, day, 15, 0),
      type: 'Evaluation',
      status: 'checked-in',
      duration: 60,
    },
    {
      id: '4',
      patientId: '4',
      patientName: 'MEJIA, SEGUNDO',
      provider: 'Dr. Emily Rodriguez',
      startTime: new Date(year, month, day, 15, 30),
      endTime: new Date(year, month, day, 16, 30),
      type: 'Follow-up',
      status: 'confirmed',
      duration: 60,
    },
  ];
};

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    mockProviders.map((p) => p.id)
  );
  const [slotInterval, setSlotInterval] = useState(15);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    appointmentId?: string;
  } | null>(null);
  const [waitListCount] = useState(3);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(() => 
    createInitialAppointments(new Date())
  );
  const [patients, setPatients] = useState(mockPatients);
  
  // Get appointments for the current date
  const getAppointmentsForDate = (date: Date): Appointment[] => {
    const dateStr = date.toDateString();
    return appointments.filter(apt => apt.startTime.toDateString() === dateStr);
  };
  
  const visibleProviders = mockProviders.filter((p) =>
    selectedProviders.includes(p.id)
  );
  
  const dateAppointments = getAppointmentsForDate(currentDate);
  const visibleAppointments = dateAppointments.filter((apt) =>
    visibleProviders.some((p) => p.name === apt.provider)
  );
  
  const handleScheduleAppointment = (appointment: Appointment, newPatient?: Patient) => {
    // Add new appointment
    setAppointments(prev => [...prev, appointment]);
    
    // Add new patient if provided
    if (newPatient) {
      setPatients(prev => [...prev, { 
        id: newPatient.id, 
        name: newPatient.name 
      }]);
    }
  };
  
  const handleToggleProvider = (providerId: string) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };
  
  const handleContextMenu = (e: React.MouseEvent, appointmentId?: string) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      appointmentId,
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <h1 className="text-h1 mb-6" style={{ fontSize: '80%' }}>Dashboard</h1>
      
      {/* Set Appointment and Patients Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
              <Plus className="w-5 h-5 text-cairos-primary" />
            </div>
            <h2 className="text-h3" style={{ fontSize: '80%' }}>Set Appointment</h2>
          </div>
          <p className="text-body text-gray-600 mb-3">
            Manually schedule an appointment with a patient
          </p>
          <Button size="sm" onClick={() => setIsScheduleModalOpen(true)}>
            Schedule Appointment
          </Button>
        </Card>
        
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-cairos-primary bg-opacity-10 rounded-lg">
              <Users className="w-5 h-5 text-cairos-primary" />
            </div>
            <h2 className="text-h3" style={{ fontSize: '80%' }}>Patients</h2>
          </div>
          <p className="text-body text-gray-600 mb-3">
            View patient charts and documentation
          </p>
          <Link href="/patients">
            <Button size="sm">View Patients</Button>
          </Link>
        </Card>
      </div>
      
      {/* Schedule Section */}
      <div className="flex gap-4">
        <CalendarSidebar currentDate={currentDate} onDateChange={setCurrentDate} />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <div className="border-b border-cairos-border p-2 bg-white mb-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-h3">Schedule</h2>
              <div className="flex items-center gap-2">
                <WaitListButton
                  count={waitListCount}
                  onClick={() => console.log('Open wait list')}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-48">
                <Select
                  label="Time Slot"
                  options={[
                    { value: '5', label: '5 minutes' },
                    { value: '10', label: '10 minutes' },
                    { value: '15', label: '15 minutes' },
                    { value: '20', label: '20 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '60 minutes' },
                  ]}
                  value={String(slotInterval)}
                  onChange={(e) => setSlotInterval(Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          {/* Schedule Grid */}
          <div
            className="overflow-auto"
            style={{ maxHeight: '500px' }}
            onContextMenu={(e) => handleContextMenu(e)}
          >
            <ScheduleGrid
              appointments={visibleAppointments}
              providers={visibleProviders.map((p) => p.name)}
              currentDate={currentDate}
              slotInterval={slotInterval}
              startHour={8}
              endHour={17}
            />
          </div>
        </div>
        
        <ResourcePanel
          providers={mockProviders}
          selectedProviders={selectedProviders}
          onToggleProvider={handleToggleProvider}
        />
      </div>
      
      {contextMenu && (
        <AppointmentContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCheckIn={() => console.log('Check in', contextMenu.appointmentId)}
          onNoShow={() => console.log('No show', contextMenu.appointmentId)}
          onCancel={() => console.log('Cancel', contextMenu.appointmentId)}
          onViewChart={() => console.log('View chart', contextMenu.appointmentId)}
          onEdit={() => console.log('Edit', contextMenu.appointmentId)}
        />
      )}
      
      <ScheduleAppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={handleScheduleAppointment}
        existingPatients={patients}
        providers={mockProviders}
        selectedDate={currentDate}
      />
    </div>
  );
}

