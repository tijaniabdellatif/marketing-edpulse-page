

import { InterestType, PreferenceType } from '@prisma/client';

function findClosestEnumMatch(input: string, enumValues: string[]): string | null {
 
  const normalizedInput = input.toUpperCase().replace(/\s+/g, '_');
  if (enumValues.includes(normalizedInput)) {
    return normalizedInput;
  }

  for (const enumValue of enumValues) {
    if (enumValue.includes(normalizedInput) || normalizedInput.includes(enumValue)) {
      return enumValue;
    }
  }

  return null;
}

/**
 * Parse comma-separated interests string into InterestType enum values
 */
export function parseInterests(interestsStr: string | any): InterestType[] {
  if (!interestsStr || typeof interestsStr !== 'string') return [];
  
  const interestsList = interestsStr
    .split(',')
    .map(item => item.trim().toUpperCase())
    .filter(Boolean);
  
  const validInterests: InterestType[] = [];
  
  interestsList.forEach(interest => {

    if (Object.values(InterestType).includes(interest as InterestType)) {
      validInterests.push(interest as InterestType);
    } else {
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
 
  if (!preferencesStr || typeof preferencesStr !== 'string') return [];
  
  const preferencesList = preferencesStr
    .split(',')
    .map(item => item.trim().toUpperCase())
    .filter(Boolean);
  
  const validPreferences: PreferenceType[] = [];
  preferencesList.forEach(preference => {
    if (Object.values(PreferenceType).includes(preference as PreferenceType)) {
      validPreferences.push(preference as PreferenceType);
    } else {
      
      const closestMatch = findClosestEnumMatch(preference, Object.values(PreferenceType));
      if (closestMatch) {
        validPreferences.push(closestMatch as PreferenceType);
      }
    }
  });
  
  return validPreferences;
}