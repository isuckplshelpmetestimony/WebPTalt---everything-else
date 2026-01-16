import { Treatment } from './billing';

/**
 * 8-Minute Rule Calculator for Medicare Billing
 * 
 * The 8-minute rule states that you can bill for a unit of service if you provide
 * at least 8 minutes of that service. Units are calculated as:
 * - 1 unit: 8-22 minutes
 * - 2 units: 23-37 minutes
 * - 3 units: 38-52 minutes
 * - 4 units: 53-67 minutes
 * - etc. (each additional unit requires 15 more minutes)
 * 
 * However, the first unit requires 8 minutes, subsequent units require 15 minutes each.
 */

export interface EightMinuteRuleResult {
  totalMinutes: number;
  billableUnits: number;
  breakdown: Array<{
    cptCode: string;
    description: string;
    minutes: number;
    units: number;
  }>;
  isCompliant: boolean;
  warnings: string[];
}

/**
 * Calculate units based on 8-minute rule
 * First unit: 8-22 minutes
 * Each additional unit: 15 minutes (23-37 = 2 units, 38-52 = 3 units, etc.)
 */
export function calculateUnitsEightMinuteRule(minutes: number): number {
  if (minutes < 8) {
    return 0; // Not billable
  }
  if (minutes <= 22) {
    return 1; // First unit (8-22 minutes)
  }
  // After first unit, each additional unit requires 15 minutes
  // 23-37 = 2 units, 38-52 = 3 units, etc.
  const additionalMinutes = minutes - 22;
  const additionalUnits = Math.floor(additionalMinutes / 15);
  return 1 + additionalUnits;
}

/**
 * Calculate minimum minutes needed for a given number of units
 */
export function getMinimumMinutesForUnits(units: number): number {
  if (units === 0) return 0;
  if (units === 1) return 8;
  // First unit (8-22) + additional units (15 minutes each)
  return 22 + (units - 1) * 15;
}

/**
 * Calculate 8-minute rule compliance for treatments
 */
export function calculateEightMinuteRule(
  treatments: Treatment[]
): EightMinuteRuleResult {
  const performedTreatments = treatments.filter(
    t => t.status === 'performed' && t.cptCode && t.totalMinutes > 0
  );

  if (performedTreatments.length === 0) {
    return {
      totalMinutes: 0,
      billableUnits: 0,
      breakdown: [],
      isCompliant: true,
      warnings: [],
    };
  }

  // Group by CPT code
  const codeMap = new Map<string, {
    cptCode: string;
    description: string;
    totalMinutes: number;
    treatments: Treatment[];
  }>();

  performedTreatments.forEach(treatment => {
    const key = treatment.cptCode;
    const existing = codeMap.get(key);

    if (existing) {
      existing.totalMinutes += treatment.totalMinutes;
      existing.treatments.push(treatment);
    } else {
      codeMap.set(key, {
        cptCode: treatment.cptCode,
        description: treatment.description || treatment.cptCode,
        totalMinutes: treatment.totalMinutes,
        treatments: [treatment],
      });
    }
  });

  // Calculate units for each CPT code
  const breakdown = Array.from(codeMap.values()).map(codeData => {
    const units = calculateUnitsEightMinuteRule(codeData.totalMinutes);
    return {
      cptCode: codeData.cptCode,
      description: codeData.description,
      minutes: codeData.totalMinutes,
      units,
    };
  });

  const totalMinutes = breakdown.reduce((sum, item) => sum + item.minutes, 0);
  const billableUnits = breakdown.reduce((sum, item) => sum + item.units, 0);

  // Check compliance and generate warnings
  const warnings: string[] = [];
  
  breakdown.forEach(item => {
    if (item.minutes < 8) {
      warnings.push(
        `⚠️ ${item.cptCode} (${item.description}): ${item.minutes} minutes is less than 8 minutes. Not billable.`
      );
    } else {
      const expectedUnits = calculateUnitsEightMinuteRule(item.minutes);
      const minMinutesForUnits = getMinimumMinutesForUnits(expectedUnits);
      if (item.minutes < minMinutesForUnits) {
        warnings.push(
          `⚠️ ${item.cptCode}: ${item.minutes} minutes only supports ${expectedUnits - 1} unit(s), not ${expectedUnits}. You need ${minMinutesForUnits}+ minutes for ${expectedUnits} units.`
        );
      }
    }
  });

  // Check total time vs total units
  const totalExpectedUnits = calculateUnitsEightMinuteRule(totalMinutes);
  if (billableUnits !== totalExpectedUnits) {
    const minMinutes = getMinimumMinutesForUnits(billableUnits);
    warnings.push(
      `⚠️ Total time (${totalMinutes} min) supports ${totalExpectedUnits} unit(s), but you're billing ${billableUnits} unit(s). You need ${minMinutes}+ minutes for ${billableUnits} units.`
    );
  }

  return {
    totalMinutes,
    billableUnits,
    breakdown,
    isCompliant: warnings.length === 0,
    warnings,
  };
}
