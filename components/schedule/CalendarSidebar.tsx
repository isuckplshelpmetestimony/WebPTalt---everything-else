'use client';

import React from 'react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { clsx } from 'clsx';

interface CalendarSidebarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  currentDate,
  onDateChange,
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const goToPreviousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };
  
  const goToNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };
  
  const goToToday = () => {
    onDateChange(new Date());
  };
  
  return (
    <div className="w-64 flex-shrink-0 border-r border-cairos-border p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <Button variant="secondary" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="secondary" size="sm" onClick={goToNextWeek}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-h3 text-center mb-4">
          {format(currentDate, 'MMMM yyyy')}
        </div>
      </div>
      
      <div className="space-y-8">
        {weekDays.map((day) => {
          const isCurrentDay = isSameDay(day, currentDate);
          const isTodayDate = isToday(day);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={clsx(
                'w-full p-2 rounded-lg text-left transition-colors',
                isCurrentDay
                  ? 'bg-cairos-primary text-white'
                  : isTodayDate
                  ? 'bg-cairos-warning bg-opacity-10 text-cairos-warning'
                  : 'hover:bg-gray-100 text-gray-700'
              )}
            >
              <div className="text-body-sm font-medium">
                {format(day, 'EEE')}
              </div>
              <div className="text-body font-semibold">
                {format(day, 'd')}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

