import { BillingCode } from '@/lib/types/document';

// Treatment interface matching the one used in TreatmentsTable
export interface Treatment {
  id: string;
  status: 'performed' | 'not-performed';
  cptCode: string;
  description: string;
  settings?: string;
  totalMinutes: number;
  isHEP: boolean;
  justification?: string;
}

// CPT Code descriptions
const cptDescriptions: Record<string, string> = {
  '97110': 'Therapeutic Exercise',
  '97112': 'Neuromuscular Re-education',
  '97130': 'Therapeutic Activities',
  '97140': 'Manual Therapy',
  '97116': 'Gait Training',
  '97010': 'Hot/Cold Pack',
  '97014': 'Electrical Stimulation',
  '97032': 'Electrical Stimulation (attended)',
  '97161': 'Physical Therapy Evaluation - Low Complexity',
  '97162': 'Physical Therapy Re-evaluation',
  '97163': 'Physical Therapy Evaluation - Moderate Complexity',
  '97164': 'Physical Therapy Re-evaluation - Moderate Complexity',
  '97165': 'Physical Therapy Evaluation - High Complexity',
  '97166': 'Physical Therapy Re-evaluation - High Complexity',
  '97167': 'Physical Therapy Evaluation - Moderate to High Complexity',
  '97168': 'Physical Therapy Re-evaluation - Moderate to High Complexity',
  'G0283': 'Unattended E-Stim',
};

// Timed CPT codes (15 minutes = 1 unit)
const timedCodes = new Set([
  '97110', // Therapeutic Exercise
  '97112', // Neuromuscular Re-education
  '97130', // Therapeutic Activities
  '97140', // Manual Therapy
  '97116', // Gait Training
  '97010', // Hot/Cold Pack
  '97014', // Electrical Stimulation
  '97032', // Electrical Stimulation (attended)
]);

// Untimed CPT codes (always 1 unit)
const untimedCodes = new Set([
  '97161', // PT Eval Low Complexity
  '97162', // PT Re-eval
  '97163', // PT Eval Moderate Complexity
  '97164', // PT Re-eval Moderate Complexity
  '97165', // PT Eval High Complexity
  '97166', // PT Re-eval High Complexity
  '97167', // PT Eval Moderate to High Complexity
  '97168', // PT Re-eval Moderate to High Complexity
]);

/**
 * Determine if a CPT code is timed (15-min units) or untimed (1 unit)
 */
export function isTimedCode(cptCode: string): boolean {
  return timedCodes.has(cptCode);
}

/**
 * Auto-calculate units based on CPT code type and minutes
 * - Timed codes: 1 unit per 15 minutes (rounded up)
 * - Untimed codes: Always 1 unit
 * - Special: G0283 (unattended e-stim) = 1 unit regardless of time
 */
export function calculateUnits(cptCode: string, minutes: number): number {
  // Special case: G0283 is always 1 unit
  if (cptCode === 'G0283') {
    return 1;
  }

  // Untimed codes are always 1 unit
  if (untimedCodes.has(cptCode)) {
    return 1;
  }

  // Timed codes: 1 unit per 15 minutes, rounded up
  if (timedCodes.has(cptCode)) {
    return Math.ceil(minutes / 15);
  }

  // Default: treat as timed code if not recognized
  return Math.ceil(minutes / 15);
}

/**
 * Get standard description for CPT code
 */
export function getCPTDescription(cptCode: string): string {
  return cptDescriptions[cptCode] || cptCode;
}

/**
 * Convert a treatment to a billing charge
 */
export function generateChargeFromTreatment(
  treatment: Treatment,
  provider: string,
  diagnosis: string,
  pos: string = '11', // Default: Office
  tos: string = '01'  // Default: Medical Care
): BillingCode {
  const units = calculateUnits(treatment.cptCode, treatment.totalMinutes);
  const description = treatment.description || getCPTDescription(treatment.cptCode);

  return {
    code: treatment.cptCode,
    description: description,
    units: units,
    time: treatment.totalMinutes,
  };
}

/**
 * Aggregate treatments by CPT code and sum units/time
 * Multiple treatments with the same CPT code are combined into one charge
 */
export function aggregateCharges(treatments: Treatment[]): BillingCode[] {
  // Filter to only performed treatments
  const performedTreatments = treatments.filter(t => t.status === 'performed' && t.cptCode);

  if (performedTreatments.length === 0) {
    return [];
  }

  // Group by CPT code
  const chargesMap = new Map<string, {
    cptCode: string;
    description: string;
    totalMinutes: number;
    treatments: Treatment[];
  }>();

  performedTreatments.forEach(treatment => {
    const key = treatment.cptCode;
    const existing = chargesMap.get(key);

    if (existing) {
      // Aggregate: sum minutes, keep first description
      existing.totalMinutes += treatment.totalMinutes;
      existing.treatments.push(treatment);
    } else {
      chargesMap.set(key, {
        cptCode: treatment.cptCode,
        description: treatment.description || getCPTDescription(treatment.cptCode),
        totalMinutes: treatment.totalMinutes,
        treatments: [treatment],
      });
    }
  });

  // Convert to BillingCode array
  const charges: BillingCode[] = [];
  chargesMap.forEach((value) => {
    const units = calculateUnits(value.cptCode, value.totalMinutes);
    charges.push({
      code: value.cptCode,
      description: value.description,
      units: units,
      time: value.totalMinutes,
    });
  });

  return charges;
}

/**
 * Generate all charges from treatments with provider and diagnosis info
 */
export function generateChargesFromTreatments(
  treatments: Treatment[],
  provider: string,
  diagnosis: string,
  pos: string = '11',
  tos: string = '01'
): BillingCode[] {
  return aggregateCharges(treatments);
}

/**
 * Calculate totals from charges
 */
export function calculateBillingTotals(charges: BillingCode[]): {
  totalUnits: number;
  totalTime: number;
  totalTimedCodes: number;
  totalUntimedCodes: number;
} {
  let totalUnits = 0;
  let totalTime = 0;
  let totalTimedCodes = 0;
  let totalUntimedCodes = 0;

  charges.forEach(charge => {
    totalUnits += charge.units;
    totalTime += charge.time;

    if (isTimedCode(charge.code)) {
      totalTimedCodes += charge.time;
    } else {
      // For untimed codes, count as 1 minute each
      totalUntimedCodes += 1;
    }
  });

  return {
    totalUnits,
    totalTime,
    totalTimedCodes,
    totalUntimedCodes,
  };
}

/**
 * Verify charges match treatments
 * Returns verification status with any issues found
 */
export function verifyCharges(
  charges: BillingCode[],
  treatments: Treatment[]
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const performedTreatments = treatments.filter(t => t.status === 'performed' && t.cptCode);

  // Check each charge has corresponding treatment
  charges.forEach(charge => {
    const matchingTreatment = performedTreatments.find(t => t.cptCode === charge.code);
    if (!matchingTreatment) {
      issues.push(`Charge ${charge.code} has no corresponding performed treatment`);
    } else {
      // Check units match
      const expectedUnits = calculateUnits(charge.code, matchingTreatment.totalMinutes);
      if (charge.units !== expectedUnits) {
        issues.push(`Charge ${charge.code} units (${charge.units}) don't match calculated units (${expectedUnits})`);
      }

      // Check time matches (for aggregated charges, this might not match exactly)
      // We'll be lenient here since charges are aggregated
    }
  });

  // Check for treatments without charges (this is okay if they're not performed)
  // But we should verify all performed treatments have charges
  performedTreatments.forEach(treatment => {
    const hasCharge = charges.some(c => c.code === treatment.cptCode);
    if (!hasCharge) {
      issues.push(`Treatment ${treatment.cptCode} (${treatment.description}) is performed but has no charge`);
    }
  });

  return {
    isValid: issues.length === 0,
    issues,
  };
}





