'use client';

import React, { useState } from 'react';
import { ScheduleGrid } from '@/components/schedule/ScheduleGrid';
import { CalendarSidebar } from '@/components/schedule/CalendarSidebar';
import { ResourcePanel } from '@/components/schedule/ResourcePanel';
import { AppointmentContextMenu } from '@/components/schedule/AppointmentContextMenu';
import { WaitListButton } from '@/components/schedule/WaitListButton';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { Appointment, Provider } from '@/lib/types/schedule';
import { Plus } from 'lucide-react';

// Mock data - replace with actual API calls
const mockProviders: Provider[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'therapist', status: 'available' },
  { id: '2', name: 'Dr. Michael Chen', role: 'therapist', status: 'busy' },
  { id: '3', name: 'Dr. Emily Rodriguez', role: 'therapist', status: 'available' },
];

// Helper to create appointments for a specific date
const createAppointmentsForDate = (date: Date): Appointment[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  return [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
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
      patientName: 'Jane Smith',
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
      patientName: 'Bob Johnson',
      provider: 'Dr. Michael Chen',
      startTime: new Date(year, month, day, 14, 0),
      endTime: new Date(year, month, day, 15, 0),
      type: 'Evaluation',
      status: 'checked-in',
      duration: 60,
    },
  ];
};

export default function SchedulePage() {
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
  
  const visibleProviders = mockProviders.filter((p) =>
    selectedProviders.includes(p.id)
  );
  
  const mockAppointments = createAppointmentsForDate(currentDate);
  const visibleAppointments = mockAppointments.filter((apt) =>
    visibleProviders.some((p) => p.name === apt.provider)
  );
  
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
    <div className="flex h-screen">
      <CalendarSidebar currentDate={currentDate} onDateChange={setCurrentDate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <div className="border-b border-cairos-border p-3 bg-white">
          <div className="mb-2">
            <Breadcrumbs items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Schedule' }
            ]} />
          </div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-h2">Schedule</h1>
            <div className="flex items-center gap-2">
              <WaitListButton
                count={waitListCount}
                onClick={() => console.log('Open wait list')}
              />
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1.5" />
                New Appointment
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
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
        
        {/* Schedule Grid */}
        <div
          className="flex-1 overflow-auto"
          onContextMenu={(e) => handleContextMenu(e)}
        >
          <ScheduleGrid
            appointments={visibleAppointments}
            providers={visibleProviders.map((p) => p.name)}
            currentDate={currentDate}
            slotInterval={slotInterval}
          />
        </div>
      </div>
      
      <ResourcePanel
        providers={mockProviders}
        selectedProviders={selectedProviders}
        onToggleProvider={handleToggleProvider}
      />
      
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
    </div>
  );
}

