/**
 * Free Play mode game logic.
 * Infinite play mode with level progression and auto-save.
 */

import type { Board, Shape, ShapeName, HistoryRecord, QueueState } from '../types';
import { freePlayModeGenerateGem } from '../engine';

/**
 * Free Play save slot identifiers.
 */
export const FREE_PLAY_SLOTS = ['A', 'B', 'C', 'D'] as const;
export type FreePlaySlot = (typeof FREE_PLAY_SLOTS)[number];

/**
 * Free Play save data structure.
 */
export interface FreePlaySaveData {
  level: number;
  alchemizations: number;
  board: Board;
  targetGem: Shape;
  currentShapeName: ShapeName;
  queueShapes: ShapeName[];
  history: HistoryRecord[];
  gameStartTimestamp: number;
}

/**
 * Free Play slot metadata for display.
 */
export interface FreePlaySlotInfo {
  slot: FreePlaySlot;
  exists: boolean;
  level?: number;
  alchemizations?: number;
}

/**
 * Create new game save data for Free Play mode.
 */
export function createNewFreePlayGame(): Omit<FreePlaySaveData, 'board' | 'targetGem' | 'currentShapeName' | 'queueShapes' | 'history'> & {
  level: number;
  alchemizations: number;
  gameStartTimestamp: number;
} {
  return {
    level: 1,
    alchemizations: 0,
    gameStartTimestamp: Date.now(),
  };
}

/**
 * Get the target gem for a Free Play level.
 */
export function getFreePlayTargetGem(level: number): Shape {
  return freePlayModeGenerateGem(level);
}

/**
 * Check if auto-save should occur (after level > 1).
 */
export function shouldAutoSave(level: number): boolean {
  return level > 1;
}

/**
 * Validate save data structure.
 */
export function isValidSaveData(data: unknown): data is FreePlaySaveData {
  if (!data || typeof data !== 'object') return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.level === 'number' &&
    typeof obj.alchemizations === 'number' &&
    Array.isArray(obj.board) &&
    Array.isArray(obj.targetGem) &&
    typeof obj.currentShapeName === 'string' &&
    Array.isArray(obj.queueShapes) &&
    Array.isArray(obj.history) &&
    typeof obj.gameStartTimestamp === 'number'
  );
}
