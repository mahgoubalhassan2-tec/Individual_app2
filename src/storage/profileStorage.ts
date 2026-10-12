import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import {
  AVAILABILITY_OPTIONS,
  AvailabilityStatus,
  Profile,
} from '../validation/profileRules';

const STORAGE_KEY = 'maaaportfolio.profile.v1';

function mediaFolder(): string | null {
  if (!FileSystem.documentDirectory) {
    return null;
  }
  return `${FileSystem.documentDirectory}profile-media/`;
}

function isAvailability(value: string): value is AvailabilityStatus {
  return AVAILABILITY_OPTIONS.includes(value as AvailabilityStatus);
}

function parseProfile(raw: string): Profile | null {
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') {
      return null;
    }
    const record = value as Record<string, unknown>;
    if (
      typeof record.headline !== 'string' ||
      typeof record.biography !== 'string' ||
      typeof record.primarySkill !== 'string' ||
      typeof record.availability !== 'string' ||
      !isAvailability(record.availability) ||
      !(record.portraitUri === null || typeof record.portraitUri === 'string') ||
      !(record.verificationCardUri === null || typeof record.verificationCardUri === 'string')
    ) {
      return null;
    }
    return {
      headline: record.headline,
      biography: record.biography,
      primarySkill: record.primarySkill,
      availability: record.availability,
      portraitUri: record.portraitUri,
      verificationCardUri: record.verificationCardUri,
    };
  } catch {
    return null;
  }
}

export async function readStoredProfile(): Promise<Profile | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  return parseProfile(raw);
}

export async function writeStoredProfile(profile: Profile): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export async function clearStoredProfile(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  const folder = mediaFolder();
  if (!folder) {
    return;
  }
  await FileSystem.deleteAsync(folder, { idempotent: true });
}

export async function copyIntoAppStorage(sourceUri: string, fileName: string): Promise<string> {
  const folder = mediaFolder();
  if (!folder) {
    return sourceUri;
  }
  const existing = await FileSystem.getInfoAsync(folder);
  if (!existing.exists) {
    await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
  }
  const dot = fileName.lastIndexOf('.');
  const stem = dot > 0 ? fileName.slice(0, dot) : fileName;
  const extension = dot > 0 ? fileName.slice(dot) : '';
  const names = await FileSystem.readDirectoryAsync(folder);
  await Promise.all(
    names
      .filter((name) => name === fileName || name.startsWith(`${stem}-`))
      .map((name) => FileSystem.deleteAsync(`${folder}${name}`, { idempotent: true })),
  );
  const destination = `${folder}${stem}-${Date.now()}${extension}`;
  await FileSystem.copyAsync({ from: sourceUri, to: destination });
  return destination;
}
