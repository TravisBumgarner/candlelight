/**
 * Storage service for persisting game data using AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  FreePlaySaveData,
  FreePlaySlot,
  FreePlaySlotInfo,
  FREE_PLAY_SLOTS,
} from '@/game/modes/free-play';
import { isValidSaveData } from '@/game/modes/free-play';

const STORAGE_KEYS = {
  FREE_PLAY_PREFIX: 'freeplay_save_',
  SETTINGS: 'settings',
  DAILY_SCORES: 'daily_scores',
  PUZZLE_PROGRESS: 'puzzle_progress',
} as const;

/**
 * Get the storage key for a Free Play save slot.
 */
function getFreePlaySlotKey(slot: FreePlaySlot): string {
  return `${STORAGE_KEYS.FREE_PLAY_PREFIX}${slot}`;
}

/**
 * Save Free Play game data to a slot.
 */
export async function saveFreePlayGame(
  slot: FreePlaySlot,
  data: FreePlaySaveData
): Promise<void> {
  const key = getFreePlaySlotKey(slot);
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

/**
 * Load Free Play game data from a slot.
 * Returns null if no save exists or data is invalid.
 */
export async function loadFreePlayGame(
  slot: FreePlaySlot
): Promise<FreePlaySaveData | null> {
  const key = getFreePlaySlotKey(slot);
  const json = await AsyncStorage.getItem(key);

  if (!json) return null;

  try {
    const data = JSON.parse(json);
    if (isValidSaveData(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Delete a Free Play save slot.
 */
export async function deleteFreePlaySave(slot: FreePlaySlot): Promise<void> {
  const key = getFreePlaySlotKey(slot);
  await AsyncStorage.removeItem(key);
}

/**
 * Get info about all Free Play save slots.
 */
export async function getFreePlaySlotInfos(
  slots: readonly FreePlaySlot[]
): Promise<FreePlaySlotInfo[]> {
  const infos: FreePlaySlotInfo[] = [];

  for (const slot of slots) {
    const data = await loadFreePlayGame(slot);
    if (data) {
      infos.push({
        slot,
        exists: true,
        level: data.level,
        alchemizations: data.alchemizations,
      });
    } else {
      infos.push({
        slot,
        exists: false,
      });
    }
  }

  return infos;
}

/**
 * Check if a Free Play save slot exists.
 */
export async function freePlaySlotExists(slot: FreePlaySlot): Promise<boolean> {
  const key = getFreePlaySlotKey(slot);
  const json = await AsyncStorage.getItem(key);
  return json !== null;
}

// Daily mode score storage

export interface DailyScore {
  dateKey: string;
  alchemizations: number;
  completedAt: number;
}

/**
 * Get the best score for a daily challenge.
 */
export async function getDailyBestScore(
  dateKey: string
): Promise<number | null> {
  const scoresJson = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_SCORES);
  if (!scoresJson) return null;

  try {
    const scores = JSON.parse(scoresJson) as Record<string, DailyScore>;
    return scores[dateKey]?.alchemizations ?? null;
  } catch {
    return null;
  }
}

/**
 * Save a daily challenge score if it's better than existing.
 */
export async function saveDailyScore(
  dateKey: string,
  alchemizations: number
): Promise<boolean> {
  const scoresJson = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_SCORES);
  let scores: Record<string, DailyScore> = {};

  try {
    if (scoresJson) {
      scores = JSON.parse(scoresJson);
    }
  } catch {
    scores = {};
  }

  const existing = scores[dateKey];
  if (existing && existing.alchemizations <= alchemizations) {
    // Not a better score
    return false;
  }

  scores[dateKey] = {
    dateKey,
    alchemizations,
    completedAt: Date.now(),
  };

  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_SCORES, JSON.stringify(scores));
  return true;
}

// Settings storage

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  hasSeenTutorial: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.5,
  sfxVolume: 0.5,
  hasSeenTutorial: false,
};

/**
 * Load game settings.
 */
export async function loadSettings(): Promise<GameSettings> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!json) return { ...DEFAULT_SETTINGS };

  try {
    const saved = JSON.parse(json);
    return {
      ...DEFAULT_SETTINGS,
      ...saved,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Save game settings.
 */
export async function saveSettings(
  settings: Partial<GameSettings>
): Promise<void> {
  const current = await loadSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
}
