'use client';

import React from 'react';
import { Appointment } from '@/lib/types/schedule';
import { format, differenceInMinutes } from 'date-fns';
import { clsx } from 'clsx';

interface AppointmentBlockProps {
  appointment: Appointment;
  slotHeight: number;
  slotInterval: number;
  topOffset?: number;
}

export const AppointmentBlock: React.FC<AppointmentBlockProps> = ({
  appointment,
  slotHeight,
  slotInterval,
  topOffset = 0,
}) => {
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);
  const duration = differenceInMinutes(end, start);
  const height = (duration / slotInterval) * slotHeight;
  
  // Google Calendar-like colors
  const statusColors = {
    confirmed: 'bg-blue-100 border-l-4 border-blue-500 text-blue-900',
    pending: 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900',
    'checked-in': 'bg-green-100 border-l-4 border-green-500 text-green-900',
    'no-show': 'bg-red-100 border-l-4 border-red-500 text-red-900',
    canceled: 'bg-gray-100 border-l-4 border-gray-400 text-gray-600',
  };
  
  return (
    <div
      className={clsx(
        'absolute left-1 right-1 rounded border-l-4 px-2 py-1 cursor-pointer',
        'hover:shadow-lg hover:z-30 transition-all z-20',
        statusColors[appointment.status]
      )}
      style={{
        top: `${topOffset + 2}px`,
        height: `${Math.max(height - 4, 20)}px`,
        minHeight: '20px',
      }}
      title={`${appointment.patientName} - ${appointment.type} (${format(start, 'h:mm')} - ${format(end, 'h:mm a')})`}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-xs truncate leading-tight">
            {appointment.patientName}
          </div>
          <div className="text-xs opacity-75 truncate leading-tight">
            {format(start, 'h:mm')} - {format(end, 'h:mm a')}
          </div>
        </div>
        {height > 40 && (
          <div className="text-xs opacity-70 truncate">
            {appointment.type}
          </div>
        )}
      </div>
    </div>
  );
};

