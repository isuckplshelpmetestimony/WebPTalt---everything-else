'use client';

import React from 'react';
import { Appointment } from '@/lib/types/schedule';
import { AppointmentBlock } from './AppointmentBlock';
import { format, startOfDay, addMinutes, setHours, setMinutes } from 'date-fns';
import { clsx } from 'clsx';

interface ScheduleGridProps {
  appointments: Appointment[];
  providers: string[];
  startHour?: number;
  endHour?: number;
  slotInterval?: number; // minutes
  currentDate: Date;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  appointments,
  providers,
  startHour = 7,
  endHour = 19,
  slotInterval = 15,
  currentDate,
}) => {
  const timeSlots: Date[] = [];
  const start = setHours(setMinutes(startOfDay(currentDate), 0), startHour);
  const end = setHours(setMinutes(startOfDay(currentDate), 0), endHour);
  
  let current = start;
  while (current <= end) {
    timeSlots.push(new Date(current));
    current = addMinutes(current, slotInterval);
  }
  
  const getAppointmentsForProvider = (provider: string) => {
    return appointments.filter((apt) => apt.provider === provider);
  };
  
  const getAppointmentPosition = (appointment: Appointment) => {
    const aptStart = new Date(appointment.startTime);
    const startMinutes = startHour * 60;
    const aptMinutes = aptStart.getHours() * 60 + aptStart.getMinutes();
    const slotMinutes = (aptMinutes - startMinutes) / slotInterval;
    const slotHeight = slotInterval === 15 ? 16 : slotInterval === 30 ? 32 : 64;
    const position = slotMinutes * slotHeight;
    return position;
  };
  
  const getCurrentTimePosition = () => {
    const now = new Date();
    if (
      format(now, 'yyyy-MM-dd') !== format(currentDate, 'yyyy-MM-dd')
    ) {
      return null;
    }
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startMinutes = startHour * 60;
    const totalSlots = ((endHour - startHour) * 60) / slotInterval;
    const currentSlot = (totalMinutes - startMinutes) / slotInterval;
    const position = (currentSlot / totalSlots) * 100;
    return position > 0 && position < 100 ? position : null;
  };
  
  const currentTimePosition = getCurrentTimePosition();
  
  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="relative min-w-full">
        {/* Time column */}
        <div className="flex border-b border-gray-200">
          <div className="w-20 flex-shrink-0">
            <div className="h-12 border-r border-gray-200"></div>
            {timeSlots.map((time, index) => {
              const isHour = time.getMinutes() === 0;
              return (
                <div
                  key={index}
                  className={clsx(
                    'border-r border-gray-200 flex items-start justify-end pr-2 text-xs text-gray-500',
                    isHour ? 'h-16' : 'h-4'
                  )}
                >
                  {isHour && (
                    <span className="leading-none">{format(time, 'h:mm a')}</span>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Provider columns */}
          <div className="flex-1 flex">
            {providers.map((provider, providerIndex) => (
              <div 
                key={provider} 
                className={clsx(
                  'flex-1 border-r border-gray-200',
                  providerIndex === providers.length - 1 && 'border-r-0'
                )}
              >
                <div className="h-12 border-b border-gray-200 px-3 py-2 font-medium text-sm text-gray-700 bg-gray-50">
                  {provider}
                </div>
                <div className="relative">
                  {/* Current time indicator */}
                  {currentTimePosition !== null && (
                    <div
                      className="absolute left-0 right-0 z-10 pointer-events-none"
                      style={{ top: `${currentTimePosition}%` }}
                    >
                      <div className="h-0.5 bg-red-500 relative">
                        <div className="absolute -left-1.5 -top-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Time slots grid */}
                  {timeSlots.map((time, index) => {
                    const isHour = time.getMinutes() === 0;
                    return (
                      <div
                        key={index}
                        className={clsx(
                          'border-b border-gray-100 relative',
                          isHour ? 'h-16' : 'h-4'
                        )}
                      />
                    );
                  })}
                  
                  {/* Appointments overlay */}
                  {getAppointmentsForProvider(provider).map((apt) => {
                    const position = getAppointmentPosition(apt);
                    return (
                      <AppointmentBlock
                        key={apt.id}
                        appointment={apt}
                        slotHeight={slotInterval === 15 ? 16 : slotInterval === 30 ? 32 : 64}
                        slotInterval={slotInterval}
                        topOffset={position}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

