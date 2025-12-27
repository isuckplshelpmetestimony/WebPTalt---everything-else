'use client';

import React from 'react';
import { CheckCircle, X, Clock, FileText, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';

interface AppointmentContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCheckIn?: () => void;
  onNoShow?: () => void;
  onCancel?: () => void;
  onViewChart?: () => void;
  onEdit?: () => void;
}

export const AppointmentContextMenu: React.FC<AppointmentContextMenuProps> = ({
  x,
  y,
  onClose,
  onCheckIn,
  onNoShow,
  onCancel,
  onViewChart,
  onEdit,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <Card
        className="fixed z-50 p-8 min-w-200"
        style={{ left: `${x}px`, top: `${y}px` }}
        padding="sm"
      >
        <div className="space-y-4">
          {onCheckIn && (
            <button
              onClick={() => {
                onCheckIn();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <CheckCircle className="w-5 h-5 text-cairos-success" />
              <span className="text-body">Check In</span>
            </button>
          )}
          {onNoShow && (
            <button
              onClick={() => {
                onNoShow();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-cairos-alert" />
              <span className="text-body">No Show</span>
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => {
                onCancel();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
              <span className="text-body">Cancel</span>
            </button>
          )}
          <div className="h-px bg-cairos-border my-8" />
          {onViewChart && (
            <button
              onClick={() => {
                onViewChart();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-body">View Chart</span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => {
                onEdit();
                onClose();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
            >
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-body">Edit Appointment</span>
            </button>
          )}
        </div>
      </Card>
    </>
  );
};

