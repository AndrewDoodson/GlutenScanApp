import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanRecord } from '../types';

const HISTORY_KEY = 'glutenscan_history';
const MAX_HISTORY = 10;

export async function saveToHistory(record: ScanRecord): Promise<void> {
  const existing = await getHistory();
  const updated = [record, ...existing].slice(0, MAX_HISTORY);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function getHistory(): Promise<ScanRecord[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}