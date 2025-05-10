// lib/utils/form-parser.ts

import { InterestType, PreferenceType } from '@prisma/client';

/**
 * Find the closest matching enum value for a given string
 * This helps map user input to valid enum values
 */
function findClosestEnumMatch(input: string, enumValues: string[]): string | null {
  // Simple matching algorithm - convert to uppercase and replace spaces with underscores
  const normalizedInput = input.toUpperCase().replace(/\s+/g, '_');
  
  // First try exact match after normalization
  if (enumValues.includes(normalizedInput)) {
    return normalizedInput;
  }
  
  // Try to find a partial match
  for (const enumValue of enumValues) {
    if (enumValue.includes(normalizedInput) || normalizedInput.includes(enumValue)) {
      return enumValue;
    }
  }
  
  // No match found
  return null;
}

/**
 * Parse comma-separated interests string into InterestType enum values
 */
export function parseInterests(interestsStr: string | any): InterestType[] {
  // Check if interestsStr is a string, if not return empty array
  if (!interestsStr || typeof interestsStr !== 'string') return [];
  
  const interestsList = interestsStr
    .split(',')
    .map(item => item.trim().toUpperCase())
    .filter(Boolean);
  
  const validInterests: InterestType[] = [];
  
  // Filter only valid enum values
  interestsList.forEach(interest => {
    // Check if the interest is a valid InterestType enum value
    if (Object.values(InterestType).includes(interest as InterestType)) {
      validInterests.push(interest as InterestType);
    } else {
      // Try to match to the closest enum value
      const closestMatch = findClosestEnumMatch(interest, Object.values(InterestType));
      if (closestMatch) {
        validInterests.push(closestMatch as InterestType);
      }
    }
  });
  
  return validInterests;
}

/**
 * Parse comma-separated preferences string into PreferenceType enum values
 */
export function parsePreferences(preferencesStr: string | any): PreferenceType[] {
  // Check if preferencesStr is a string, if not return empty array
  if (!preferencesStr || typeof preferencesStr !== 'string') return [];
  
  const preferencesList = preferencesStr
    .split(',')
    .map(item => item.trim().toUpperCase())
    .filter(Boolean);
  
  const validPreferences: PreferenceType[] = [];
  
  // Filter only valid enum values
  preferencesList.forEach(preference => {
    // Check if the preference is a valid PreferenceType enum value
    if (Object.values(PreferenceType).includes(preference as PreferenceType)) {
      validPreferences.push(preference as PreferenceType);
    } else {
      // Try to match to the closest enum value
      const closestMatch = findClosestEnumMatch(preference, Object.values(PreferenceType));
      if (closestMatch) {
        validPreferences.push(closestMatch as PreferenceType);
      }
    }
  });
  
  return validPreferences;
}