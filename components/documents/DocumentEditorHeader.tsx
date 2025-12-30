'use client';

import React from 'react';
import { Patient, Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { User, Calendar, Clock, Heart, Activity, ChevronDown } from 'lucide-react';

interface DocumentEditorHeaderProps {
  patient: Patient;
  activeCase?: Case;
  entryDate: Date;
  timeIn?: string;
  timeOut?: string;
  onDateChange?: (date: Date) => void;
  onTimeInChange?: (time: string) => void;
  onTimeOutChange?: (time: string) => void;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    oxygenSaturation?: number;
  };
  onVitalsChange?: (vitals: { bloodPressure?: string; heartRate?: number; oxygenSaturation?: number }) => void;
  stickyTop?: string; // Optional prop to control sticky top position
}

export const DocumentEditorHeader: React.FC<DocumentEditorHeaderProps> = ({
  patient,
  activeCase,
  entryDate,
  timeIn,
  timeOut,
  onDateChange,
  onTimeInChange,
  onTimeOutChange,
  vitals,
  onVitalsChange,
  stickyTop = 'top-[93px]', // Default to 93px: nav tabs (43px) + breadcrumbs (~50px)
}) => {
  const calculateDuration = () => {
    if (!timeIn || !timeOut) return null;
    
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    const inTotal = inHours * 60 + inMinutes;
    const outTotal = outHours * 60 + outMinutes;
    const duration = outTotal - inTotal;
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const duration = calculateDuration();

  return (
    <Card className={`p-4 mb-6 sticky ${stickyTop} z-30 bg-white shadow-sm backdrop-blur-sm`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Patient & Case Info */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <h2 className="text-h3 text-gray-900">{patient.name}</h2>
          </div>
          {activeCase && (
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" size="xs">
                {activeCase.name}
              </Badge>
            </div>
          )}
          <div className="text-body-xs text-gray-500">
            {patient.insurance.name}
            {patient.patientType === 'workers-comp' && (
              <Badge variant="warning" size="xs" className="ml-2">
                WORKERS COMP
              </Badge>
            )}
          </div>
        </div>

        {/* Date of Service */}
        <div>
          <div className="flex items-center gap-2 text-body-xs text-gray-500 mb-1">
            <Calendar className="w-3 h-3" />
            <span>Date of Service</span>
          </div>
          <div className="relative">
            <input
              type="date"
              value={entryDate.toISOString().split('T')[0]}
              onChange={(e) => onDateChange?.(new Date(e.target.value))}
              onClick={(e) => {
                const input = e.currentTarget;
                input.focus();
                if ('showPicker' in HTMLInputElement.prototype) {
                  (input as any).showPicker();
                }
              }}
              className="w-full text-body-sm font-medium text-gray-900 border border-cairos-border rounded-lg pl-2 pr-8 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary cursor-pointer"
            />
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Time Tracking */}
        <div>
          <div className="flex items-center gap-2 text-body-xs text-gray-500 mb-1">
            <Clock className="w-3 h-3" />
            <span>Time</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="relative">
              <input
                type="time"
                value={timeIn || ''}
                onChange={(e) => onTimeInChange?.(e.target.value)}
                onClick={(e) => {
                  const input = e.currentTarget;
                  input.focus();
                  if ('showPicker' in HTMLInputElement.prototype) {
                    (input as any).showPicker();
                  }
                }}
                className="text-body-xs border border-cairos-border rounded-lg pl-1.5 pr-7 py-1 w-20 bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary cursor-pointer"
                placeholder="In"
              />
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
            <span className="text-body-xs text-gray-400">-</span>
            <div className="relative">
              <input
                type="time"
                value={timeOut || ''}
                onChange={(e) => onTimeOutChange?.(e.target.value)}
                onClick={(e) => {
                  const input = e.currentTarget;
                  input.focus();
                  if ('showPicker' in HTMLInputElement.prototype) {
                    (input as any).showPicker();
                  }
                }}
                className="text-body-xs border border-cairos-border rounded-lg pl-1.5 pr-7 py-1 w-20 bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary cursor-pointer"
                placeholder="Out"
              />
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
            {duration && (
              <span className="text-body-xs text-gray-500">({duration})</span>
            )}
          </div>
        </div>

        {/* Vitals */}
        <div>
          <div className="flex items-center gap-2 text-body-xs text-gray-500 mb-1">
            <Heart className="w-3 h-3" />
            <span>Vitals</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <input
              type="text"
              placeholder="BP"
              value={vitals?.bloodPressure || ''}
              onChange={(e) => onVitalsChange?.({ ...vitals, bloodPressure: e.target.value })}
              className="text-body-xs border border-cairos-border rounded-lg px-1.5 py-1 w-14 bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
            />
            <input
              type="number"
              placeholder="HR"
              value={vitals?.heartRate || ''}
              onChange={(e) => onVitalsChange?.({ ...vitals, heartRate: Number(e.target.value) })}
              className="text-body-xs border border-cairos-border rounded-lg px-1.5 py-1 w-14 bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
            />
            <input
              type="number"
              placeholder="O2"
              value={vitals?.oxygenSaturation || ''}
              onChange={(e) => onVitalsChange?.({ ...vitals, oxygenSaturation: Number(e.target.value) })}
              className="text-body-xs border border-cairos-border rounded-lg px-1.5 py-1 w-16 bg-white focus:outline-none focus:ring-2 focus:ring-cairos-primary"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

