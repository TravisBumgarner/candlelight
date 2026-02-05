/**
 * Puzzle mode game logic.
 * Campaign mode with world/level selection and fixed queues.
 */

import type { Point, ShapeName, Shape } from '../types';
import puzzleLevelsData from '../data/puzzle-levels.json';

/**
 * Level data structure from JSON.
 */
export interface PuzzleLevelData {
  queue: ShapeName[];
  targetGem: Point[];
  levelNumber: number;
  uniqueId: string;
}

/**
 * World data structure.
 */
export interface PuzzleWorldData {
  worldNumber: number;
  worldName: string;
  levels: PuzzleLevelData[];
}

/**
 * All puzzle levels indexed by world number.
 */
export type PuzzleLevelsData = Record<string, PuzzleWorldData>;

/**
 * Get all puzzle levels data.
 */
export function getPuzzleLevelsData(): PuzzleLevelsData {
  return puzzleLevelsData as PuzzleLevelsData;
}

/**
 * Get all worlds metadata.
 */
export function getWorldsMetadata(): { worldNumber: number; worldName: string; levelCount: number }[] {
  const data = getPuzzleLevelsData();
  return Object.values(data).map((world) => ({
    worldNumber: world.worldNumber,
    worldName: world.worldName,
    levelCount: world.levels.length,
  }));
}

/**
 * Get a specific world's data.
 */
export function getWorldData(worldNumber: number): PuzzleWorldData | null {
  const data = getPuzzleLevelsData();
  return data[String(worldNumber)] ?? null;
}

/**
 * Get a specific level's data.
 */
export function getLevelData(worldNumber: number, levelNumber: number): PuzzleLevelData | null {
  const world = getWorldData(worldNumber);
  if (!world) return null;

  // Level numbers are 1-indexed, array is 0-indexed
  return world.levels[levelNumber - 1] ?? null;
}

/**
 * Get the next world and level numbers after completing a level.
 * Returns null if this was the last level.
 */
export function getNextLevel(
  worldNumber: number,
  levelNumber: number
): { worldNumber: number; levelNumber: number } | null {
  const world = getWorldData(worldNumber);
  if (!world) return null;

  // Check if there's a next level in the same world
  if (levelNumber < world.levels.length) {
    return { worldNumber, levelNumber: levelNumber + 1 };
  }

  // Check the next world
  const nextWorld = getWorldData(worldNumber + 1);
  if (!nextWorld) return null;

  return { worldNumber: worldNumber + 1, levelNumber: 1 };
}

/**
 * Total number of levels across all worlds.
 */
export function getTotalLevelCount(): number {
  const data = getPuzzleLevelsData();
  return Object.values(data).reduce((sum, world) => sum + world.levels.length, 0);
}

/**
 * Check if a level is unlocked based on max available progress.
 */
export function isLevelUnlocked(
  worldNumber: number,
  levelNumber: number,
  maxWorld: number,
  maxLevel: number
): boolean {
  if (worldNumber < maxWorld) return true;
  if (worldNumber === maxWorld && levelNumber <= maxLevel) return true;
  return false;
}

/**
 * Puzzle progress data structure.
 */
export interface PuzzleProgress {
  maxWorldNumber: number;
  maxLevelNumber: number;
  levelScores: Record<string, number>; // puzzleId -> best score
}

/**
 * Create initial puzzle progress.
 */
export function createInitialProgress(): PuzzleProgress {
  return {
    maxWorldNumber: 1,
    maxLevelNumber: 1,
    levelScores: {},
  };
}

/**
 * Create a puzzle ID from world and level numbers.
 */
export function createPuzzleId(worldNumber: number, levelNumber: number): string {
  return `${worldNumber}_${levelNumber}`;
}

/**
 * Update progress after completing a level.
 */
export function updateProgressAfterComplete(
  progress: PuzzleProgress,
  worldNumber: number,
  levelNumber: number,
  score: number
): PuzzleProgress {
  const puzzleId = createPuzzleId(worldNumber, levelNumber);
  const nextLevel = getNextLevel(worldNumber, levelNumber);

  // Update max available if we unlocked a new level
  let { maxWorldNumber, maxLevelNumber } = progress;
  if (nextLevel) {
    const currentMax = { worldNumber: maxWorldNumber, levelNumber: maxLevelNumber };
    const next = { worldNumber: nextLevel.worldNumber, levelNumber: nextLevel.levelNumber };

    if (
      next.worldNumber > currentMax.worldNumber ||
      (next.worldNumber === currentMax.worldNumber && next.levelNumber > currentMax.levelNumber)
    ) {
      maxWorldNumber = next.worldNumber;
      maxLevelNumber = next.levelNumber;
    }
  }

  // Update best score if better
  const existingScore = progress.levelScores[puzzleId];
  const newScore = existingScore === undefined || score < existingScore ? score : existingScore;

  return {
    maxWorldNumber,
    maxLevelNumber,
    levelScores: {
      ...progress.levelScores,
      [puzzleId]: newScore,
    },
  };
}
