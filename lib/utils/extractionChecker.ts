/**
 * Utility functions to check which sections were extracted from the AI response
 */

import { ExtractedDataBySection } from '@/lib/types/extraction';

/**
 * Check if a section has meaningful data extracted
 */
function hasExtractedData(sectionData: any): boolean {
  if (!sectionData || typeof sectionData !== 'object') {
    return false;
  }

  // Check if any property has a non-empty value
  return Object.values(sectionData).some(value => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (typeof value === 'boolean') {
      return true; // Boolean values are meaningful
    }
    if (typeof value === 'number') {
      return !isNaN(value);
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length > 0;
    }
    return true;
  });
}

/**
 * Get a set of section IDs that were successfully extracted
 */
export function getExtractedSections(extractedData: ExtractedDataBySection): Set<string> {
  const extractedSections = new Set<string>();

  // Map of section keys in ExtractedDataBySection to their section IDs
  const sectionKeyMap: Record<string, string> = {
    'current-condition': 'current-condition',
    'depression': 'depression',
    'social-drivers': 'social-drivers',
    'elder-maltreatment': 'elder-maltreatment',
    'falls': 'falls',
    'bmi': 'bmi',
    'urinary-incontinence': 'urinary-incontinence',
    'dementia': 'dementia',
    'diabetes': 'diabetes',
    'pain-history': 'pain-history',
    'functional-status': 'functional-status',
    'medical-history': 'medical-history',
  };

  // Check each section
  for (const [key, sectionId] of Object.entries(sectionKeyMap)) {
    const sectionData = (extractedData as any)[key];
    if (hasExtractedData(sectionData)) {
      extractedSections.add(sectionId);
    }
  }

  return extractedSections;
}



