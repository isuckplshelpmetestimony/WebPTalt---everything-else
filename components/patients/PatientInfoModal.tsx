'use client';

import React from 'react';
import { Patient, Case } from '@/lib/types/patient';
import { formatDate } from '@/lib/utils/date';
import { Modal } from '../ui/Modal';
import { Card } from '../ui/Card';
import { User, Calendar, Phone, Mail, MapPin, Shield, TrendingUp, FileText } from 'lucide-react';

interface PatientInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const PatientInfoModal: React.FC<PatientInfoModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const age = calculateAge(patient.dob);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Information" size="lg">
      <div className="space-y-4">
        {/* Demographics */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-cairos-primary" />
            <h3 className="text-h3 text-gray-900">Demographics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Name</div>
              <div className="text-body font-semibold text-gray-900">{patient.name}</div>
            </div>
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Date of Birth</div>
              <div className="text-body font-semibold text-gray-900">
                {formatDate(patient.dob)} ({age} years old)
              </div>
            </div>
            {patient.gender && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Gender</div>
                <div className="text-body font-semibold text-gray-900">{patient.gender}</div>
              </div>
            )}
            {patient.phone && (
              <div>
                <div className="flex items-center gap-2 text-body-sm text-gray-600 mb-1">
                  <Phone className="w-4 h-4" />
                  <span>Phone</span>
                </div>
                <div className="text-body font-semibold text-gray-900">{patient.phone}</div>
              </div>
            )}
            {patient.email && (
              <div>
                <div className="flex items-center gap-2 text-body-sm text-gray-600 mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </div>
                <div className="text-body font-semibold text-gray-900">{patient.email}</div>
              </div>
            )}
            {patient.address && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 text-body-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </div>
                <div className="text-body font-semibold text-gray-900">
                  {[
                    patient.address.street,
                    patient.address.city,
                    patient.address.state,
                    patient.address.zip,
                  ].filter(Boolean).join(', ')}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Insurance Details */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-h3 text-gray-900">Insurance Information</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Primary Insurance</div>
              <div className="text-body font-semibold text-gray-900">{patient.insurance.name}</div>
            </div>
            {patient.insurance.policyNumber && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Policy Number</div>
                <div className="text-body font-semibold text-gray-900">{patient.insurance.policyNumber}</div>
              </div>
            )}
            {patient.insurance.groupNumber && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Group Number</div>
                <div className="text-body font-semibold text-gray-900">{patient.insurance.groupNumber}</div>
              </div>
            )}
            {patient.insurance.coverageStartDate && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Coverage Start Date</div>
                <div className="text-body font-semibold text-gray-900">
                  {formatDate(patient.insurance.coverageStartDate)}
                </div>
              </div>
            )}
            {patient.insurance.coverageEndDate && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Coverage End Date</div>
                <div className="text-body font-semibold text-gray-900">
                  {formatDate(patient.insurance.coverageEndDate)}
                </div>
              </div>
            )}
            {patient.insurance.secondaryInsurance && (
              <div className="pt-3 border-t border-cairos-border">
                <div className="text-body-sm text-gray-600 mb-1">Secondary Insurance</div>
                <div className="text-body font-semibold text-gray-900">
                  {patient.insurance.secondaryInsurance.name}
                </div>
                {patient.insurance.secondaryInsurance.policyNumber && (
                  <div className="text-body-sm text-gray-600 mt-1">
                    Policy: {patient.insurance.secondaryInsurance.policyNumber}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Cases List */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-cairos-primary" />
            <h3 className="text-h3 text-gray-900">All Cases</h3>
          </div>
          <div className="space-y-2">
            {patient.cases.map((caseItem) => (
              <div key={caseItem.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="text-body font-semibold text-gray-900 mb-1">{caseItem.name}</div>
                <div className="flex items-center gap-4 text-body-xs text-gray-500">
                  <span>Created: {formatDate(caseItem.createdDate)}</span>
                  {caseItem.expirationDate && (
                    <span>Expires: {formatDate(caseItem.expirationDate)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Arrival Rate Details */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-cairos-success" />
            <h3 className="text-h3 text-gray-900">Arrival Rate Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Arrival Rate</div>
              <div className="text-body font-semibold text-gray-900">
                {patient.arrivalRate.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-body-sm text-gray-600 mb-1">Cancellations</div>
              <div className="text-body font-semibold text-gray-900">
                {patient.cancels || 0}
              </div>
            </div>
            <div>
              <div className="text-body-sm text-gray-600 mb-1">No Shows</div>
              <div className="text-body font-semibold text-gray-900">
                {patient.noShows || 0}
              </div>
            </div>
            {patient.stationNumber && (
              <div>
                <div className="text-body-sm text-gray-600 mb-1">Station Number</div>
                <div className="text-body font-semibold text-gray-900">
                  {patient.stationNumber}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

