'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { Input } from '../ui/Input';

interface TimeTrackerProps {
  timeIn?: string;
  timeOut?: string;
  onTimeInChange: (time: string) => void;
  onTimeOutChange: (time: string) => void;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({
  timeIn,
  timeOut,
  onTimeInChange,
  onTimeOutChange,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-600" />
        <h3 className="text-h3">Time Tracking</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            type="time"
            label="Time In"
            value={timeIn || ''}
            onChange={(e) => onTimeInChange(e.target.value)}
          />
        </div>
        
        <div>
          <Input
            type="time"
            label="Time Out"
            value={timeOut || ''}
            onChange={(e) => onTimeOutChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

