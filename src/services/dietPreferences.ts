import AsyncStorage from '@react-native-async-storage/async-storage';
import { DietKey } from '../types';

const PREFS_KEY = 'glutenscan_diet_preferences';
const ONBOARDING_KEY = 'glutenscan_onboarding_complete';

export async function saveDietPreferences(diets: DietKey[]): Promise<void> {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(diets));
}

export async function loadDietPreferences(): Promise<DietKey[]> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  return raw ? JSON.parse(raw) : ['glutenFree'];
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function isOnboardingComplete(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDING_KEY);
  return val === 'true';
}