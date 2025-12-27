import React from 'react';
import { StickyNote, AlertTriangle } from 'lucide-react';
import { Authorization, Case } from '@/lib/types/patient';

interface PatientAlertsProps {
  authorization?: Authorization;
  cases: Case[];
  incompleteNotesCount?: number;
}

export const PatientAlerts: React.FC<PatientAlertsProps> = ({
  authorization,
  cases,
  incompleteNotesCount,
}) => {
  const alerts: Array<{ variant: 'warning' | 'alert'; message: string; icon: React.ReactNode }> = [];
  
  // Check for incomplete notes - WebPT format
  if (incompleteNotesCount && incompleteNotesCount >= 2) {
    alerts.push({
      variant: 'warning',
      message: '2 or more incomplete notes',
      icon: <StickyNote className="w-4 h-4" />,
    });
  } else if (incompleteNotesCount === 1) {
    alerts.push({
      variant: 'warning',
      message: '1 incomplete note',
      icon: <StickyNote className="w-4 h-4" />,
    });
  }
  
  // Check for expiring/expired authorizations - WebPT format
  if (authorization) {
    const daysUntilExpiry = Math.ceil(
      (authorization.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (authorization.status === 'expired' || daysUntilExpiry < 0) {
      alerts.push({
        variant: 'alert',
        message: "Patient's authorization expires in less than 1 day or has expired",
        icon: <AlertTriangle className="w-4 h-4" />,
      });
    } else if (authorization.status === 'expiring' || daysUntilExpiry <= 1) {
      alerts.push({
        variant: 'warning',
        message: "Patient's authorization expires in less than 1 day or has expired",
        icon: <AlertTriangle className="w-4 h-4" />,
      });
    }
  }
  
  // Check cases for expiring/expired
  cases.forEach((caseItem) => {
    if (caseItem.authorizationStatus === 'expired') {
      alerts.push({
        variant: 'alert',
        message: "Patient's authorization expires in less than 1 day or has expired",
        icon: <AlertTriangle className="w-4 h-4" />,
      });
    } else if (caseItem.authorizationStatus === 'expiring') {
      const daysUntilExpiry = caseItem.expirationDate 
        ? Math.ceil((caseItem.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      if (daysUntilExpiry <= 1) {
        alerts.push({
          variant: 'warning',
          message: "Patient's authorization expires in less than 1 day or has expired",
          icon: <AlertTriangle className="w-4 h-4" />,
        });
      }
    }
  });
  
  if (alerts.length === 0) return null;
  
  return (
    <div className="bg-cairos-warning bg-opacity-10 border border-cairos-warning rounded-lg p-3 mb-3">
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-center gap-2">
            {alert.icon}
            <span className="text-body-sm font-medium text-gray-900">
              {alert.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

