'use client';

import React from 'react';
import { Appointment } from '@/lib/types/schedule';
import { format, startOfDay } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { clsx } from 'clsx';

interface CompactScheduleProps {
  appointments: Appointment[];
  maxAppointments?: number;
  selectedDate?: Date;
}

export const CompactSchedule: React.FC<CompactScheduleProps> = ({
  appointments,
  maxAppointments = 6,
  selectedDate = new Date(),
}) => {
  const selectedDay = startOfDay(selectedDate);
  const isToday = selectedDay.getTime() === startOfDay(new Date()).getTime();
  
  const filteredAppointments = appointments
    .filter((apt) => {
      const aptDate = startOfDay(new Date(apt.startTime));
      return aptDate.getTime() === selectedDay.getTime();
    })
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, maxAppointments);

  const statusColors = {
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'checked-in': 'bg-green-100 text-green-700 border-green-200',
    'no-show': 'bg-red-100 text-red-700 border-red-200',
    canceled: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const statusBadges = {
    confirmed: 'Confirmed',
    pending: 'Pending',
    'checked-in': 'Checked In',
    'no-show': 'No Show',
    canceled: 'Canceled',
  };

  return (
    <Card className="flex flex-col max-h-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-cairos-primary" />
        <h2 className="text-h3">
          {isToday ? "Today's Schedule" : format(selectedDate, "MMMM d") + "'s Schedule"}
        </h2>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-body-sm py-8">
          No appointments scheduled for {isToday ? 'today' : format(selectedDate, 'MMMM d')}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredAppointments.map((appointment) => {
            const start = new Date(appointment.startTime);
            const end = new Date(appointment.endTime);
            
            return (
              <div
                key={appointment.id}
                className={clsx(
                  'p-3 rounded-lg border transition-all hover:shadow-sm',
                  statusColors[appointment.status]
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs font-medium">
                        {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                      </span>
                    </div>
                    <div className="font-medium text-sm truncate mb-1">
                      {appointment.patientName}
                    </div>
                    <div className="text-xs opacity-75 truncate">
                      {appointment.provider}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {appointment.type}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-white/50">
                      {statusBadges[appointment.status]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

