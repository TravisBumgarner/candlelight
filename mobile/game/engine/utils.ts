/**
 * Utility functions for game logic.
 * Ported from Utilities.gd
 */

import { GRID, BOARD_ORIGIN, BOARD_END } from '../constants';
import type { Point, Shape } from '../types';

/**
 * Check if a cell position is within the valid board range.
 * @param cell - The cell position to check
 * @param min - Minimum bounds (inclusive)
 * @param max - Maximum bounds (inclusive)
 */
export function isCellInRange(cell: Point, min: Point, max: Point): boolean {
  return (
    cell.x >= min.x && cell.x <= max.x && cell.y >= min.y && cell.y <= max.y
  );
}

/**
 * Check if a cell is outside the playable board area (border).
 * @param cell - The cell position to check
 */
export function isCellBorder(cell: Point): boolean {
  return !isCellInRange(cell, BOARD_ORIGIN, {
    x: BOARD_END.x - 1,
    y: BOARD_END.y - 1,
  });
}

/**
 * Get valid neighboring cells (4-directional: up, down, left, right).
 * @param cell - The center cell
 * @param min - Minimum bounds (inclusive)
 * @param max - Maximum bounds (inclusive)
 */
export function getValidNeighbors(
  cell: Point,
  min: Point,
  max: Point
): Point[] {
  const allNeighbors: Point[] = [
    { x: cell.x + 1, y: cell.y },
    { x: cell.x - 1, y: cell.y },
    { x: cell.x, y: cell.y + 1 },
    { x: cell.x, y: cell.y - 1 },
  ];

  return allNeighbors.filter((neighbor) => isCellInRange(neighbor, min, max));
}

/**
 * Move a collection of cells so that at least one point touches (0, n)
 * and one point touches (m, 0). Normalizes shape to origin.
 * @param cells - Array of cell positions
 */
export function moveCellsToOrigin(cells: Point[]): Point[] {
  if (cells.length === 0) return [];

  const minX = Math.min(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));

  return cells.map((cell) => ({
    x: cell.x - minX,
    y: cell.y - minY,
  }));
}

/**
 * Simple seeded random number generator (Linear Congruential Generator).
 * Matches behavior needed for consistent daily puzzles.
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  /**
   * Get next random integer.
   */
  next(): number {
    // LCG parameters (same as many implementations)
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed;
  }

  /**
   * Get random integer in range [min, max] (inclusive).
   */
  nextInRange(min: number, max: number): number {
    return min + (this.next() % (max - min + 1));
  }

  /**
   * Get random item from array.
   */
  randomItem<T>(arr: T[]): T {
    return arr[this.next() % arr.length];
  }

  /**
   * Shuffle array in place using Fisher-Yates.
   */
  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.next() % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

/**
 * Generate a hash key from a date for daily puzzle seeding.
 * Uses the same format as the desktop version.
 */
export function generateKeyFromDate(date: Date = new Date()): number {
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  return hashString(dateString);
}

/**
 * Get the current date as a string for daily puzzle identification.
 * Format: YYYY-MM-DD
 */
export function getDailyPuzzleDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Simple string hash function.
 * Produces consistent integer hash for seeding.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Create a puzzle ID string from world and level numbers.
 * Format: "worldNumber_levelNumber"
 */
export function createPuzzleId(
  worldNumber: number,
  levelNumber: number
): string {
  return `${worldNumber}_${levelNumber}`;
}

/**
 * Parse a puzzle ID string into world and level numbers.
 */
export function parsePuzzleId(
  puzzleId: string
): { worldNumber: number; levelNumber: number } | null {
  const parts = puzzleId.split('_');
  if (parts.length !== 2) return null;

  const worldNumber = parseInt(parts[0], 10);
  const levelNumber = parseInt(parts[1], 10);

  if (isNaN(worldNumber) || isNaN(levelNumber)) return null;

  return { worldNumber, levelNumber };
}

/**
 * Compare two world/level pairs to determine if one comes before the other.
 * Returns true if pairA < pairB in level order.
 */
export function isLessThanWorldLevel(
  pairA: { worldNumber: number; levelNumber: number },
  pairB: { worldNumber: number; levelNumber: number }
): boolean {
  if (pairA.worldNumber < pairB.worldNumber) return true;
  if (pairA.worldNumber > pairB.worldNumber) return false;
  return pairA.levelNumber < pairB.levelNumber;
}

/**
 * Compare two shapes for equality (same cells when normalized to origin).
 */
export function shapesEqual(shapeA: Shape, shapeB: Shape): boolean {
  if (shapeA.length !== shapeB.length) return false;

  const normalizedA = moveCellsToOrigin(shapeA);
  const normalizedB = moveCellsToOrigin(shapeB);

  // Sort both arrays for comparison
  const sortedA = [...normalizedA].sort((a, b) =>
    a.x !== b.x ? a.x - b.x : a.y - b.y
  );
  const sortedB = [...normalizedB].sort((a, b) =>
    a.x !== b.x ? a.x - b.x : a.y - b.y
  );

  return sortedA.every(
    (point, index) =>
      point.x === sortedB[index].x && point.y === sortedB[index].y
  );
}

/**
 * Add two points together.
 */
export function addPoints(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Check if two points are equal.
 */
export function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Deep clone an object (for immutable state updates).
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
