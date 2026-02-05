/**
 * Daily mode game logic.
 * Date-seeded daily challenge with consistent worldwide puzzle.
 */

import { generateKeyFromDate, getDailyPuzzleDate } from '../engine';
import { dailyModeGenerateGem } from '../engine';
import type { Shape } from '../types';

/**
 * Get today's date key for storage.
 */
export function getTodayDateKey(): string {
  return getDailyPuzzleDate();
}

/**
 * Get the seed for today's daily puzzle.
 */
export function getTodaySeed(): number {
  return generateKeyFromDate();
}

/**
 * Generate today's target gem.
 */
export function getTodayTargetGem(): Shape {
  const seed = getTodaySeed();
  return dailyModeGenerateGem(seed);
}

/**
 * Daily game state for tracking completion.
 */
export interface DailyGameState {
  dateKey: string;
  isComplete: boolean;
  score: number;
  bestScore: number | null;
}

/**
 * Create initial daily game state for today.
 */
export function createDailyGameState(bestScore: number | null = null): DailyGameState {
  return {
    dateKey: getTodayDateKey(),
    isComplete: false,
    score: 0,
    bestScore,
  };
}

/**
 * Check if the score is a new best.
 */
export function isNewBestScore(score: number, bestScore: number | null): boolean {
  if (bestScore === null) return true;
  return score < bestScore;
}
