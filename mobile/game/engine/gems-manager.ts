/**
 * Gems manager for gem generation and matching.
 * Handles target gem generation and finding matching shapes on the board.
 */

import { GRID, MAX_GEM_SIZE } from '../constants';
import type { Board, CellState, Point, Shape } from '../types';
import { getCellState } from './board';
import {
  SeededRandom,
  getValidNeighbors,
  moveCellsToOrigin,
  shapesEqual,
} from './utils';

/**
 * Map level number to gem size for Free Play mode.
 * Size increases as player progresses through levels.
 */
export function freePlayLevelToGemSize(level: number): number {
  if (level < 2) return 1;
  if (level < 4) return 2;
  if (level < 7) return 3;
  if (level < 10) return 4;
  if (level < 15) return 5;
  if (level < 21) return 6;
  if (level < 27) return 7;
  if (level < 34) return 8;
  if (level < 39) return 9;
  if (level < 44) return 10;
  if (level < 50) return 11;
  if (level < 56) return 12;
  if (level < 61) return 13;
  if (level < 66) return 14;
  return 15;
}

/**
 * Generate a random connected gem shape of the given size.
 * Uses seeded random if seed is provided.
 */
export function generateGem(size: number, seed?: number): Shape {
  const rng = seed !== undefined ? new SeededRandom(seed) : null;

  const randomInRange = (min: number, max: number) =>
    rng ? rng.nextInRange(min, max) : Math.floor(Math.random() * (max - min + 1)) + min;

  const shuffleArray = <T>(arr: T[]): T[] => {
    if (rng) return rng.shuffle(arr);
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Start in the middle for best chance of reaching desired size
  const startX = Math.round(MAX_GEM_SIZE / 2);
  const startY = Math.round(MAX_GEM_SIZE / 2);
  const currentPoint: Point = { x: startX, y: startY };
  const points: Point[] = [currentPoint];

  const minBound: Point = { x: 0, y: 0 };
  const maxBound: Point = { x: MAX_GEM_SIZE - 1, y: MAX_GEM_SIZE - 1 };

  let potentialNeighbors = getValidNeighbors(currentPoint, minBound, maxBound);

  while (points.length < size) {
    potentialNeighbors = shuffleArray(potentialNeighbors);

    let newNeighbor: Point | null = null;

    for (const neighbor of potentialNeighbors) {
      const alreadyInPoints = points.some(
        (p) => p.x === neighbor.x && p.y === neighbor.y
      );
      if (!alreadyInPoints) {
        newNeighbor = neighbor;
        break;
      }
    }

    // If no valid neighbor found, we've spiraled in - break early
    if (newNeighbor === null) {
      break;
    }

    points.push(newNeighbor);
    potentialNeighbors = getValidNeighbors(newNeighbor, minBound, maxBound);
  }

  return moveCellsToOrigin(points);
}

/**
 * Generate a gem for Daily mode using the date as seed.
 * Size is fixed between 8-12 cells.
 */
export function dailyModeGenerateGem(dateKey: number): Shape {
  const rng = new SeededRandom(dateKey);
  const size = rng.nextInRange(8, 12);

  // Use the seed for consistent generation
  const startX = rng.nextInRange(0, MAX_GEM_SIZE - 1);
  const startY = rng.nextInRange(0, MAX_GEM_SIZE - 1);

  const currentPoint: Point = { x: startX, y: startY };
  const points: Point[] = [currentPoint];

  const minBound: Point = { x: 0, y: 0 };
  const maxBound: Point = { x: MAX_GEM_SIZE - 1, y: MAX_GEM_SIZE - 1 };

  let potentialNeighbors = getValidNeighbors(currentPoint, minBound, maxBound);

  while (points.length < size) {
    potentialNeighbors = rng.shuffle(potentialNeighbors);

    let newNeighbor: Point | null = null;

    for (const neighbor of potentialNeighbors) {
      const alreadyInPoints = points.some(
        (p) => p.x === neighbor.x && p.y === neighbor.y
      );
      if (!alreadyInPoints) {
        newNeighbor = neighbor;
        break;
      }
    }

    if (newNeighbor === null) {
      break;
    }

    points.push(newNeighbor);
    potentialNeighbors = getValidNeighbors(newNeighbor, minBound, maxBound);
  }

  return moveCellsToOrigin(points);
}

/**
 * Generate gem for Free Play mode based on level.
 */
export function freePlayModeGenerateGem(level: number): Shape {
  const size = freePlayLevelToGemSize(level);
  return generateGem(size);
}

/**
 * Find all connected regions of a specific cell state on the board.
 * Uses flood-fill algorithm.
 */
export function findShapes(board: Board, cellState: CellState): Shape[] {
  const visited: boolean[][] = [];
  for (let x = 0; x < GRID.WIDTH; x++) {
    visited[x] = [];
    for (let y = 0; y < GRID.HEIGHT; y++) {
      visited[x][y] = false;
    }
  }

  const shapes: Shape[] = [];

  for (let x = 0; x < GRID.WIDTH; x++) {
    for (let y = 0; y < GRID.HEIGHT; y++) {
      const state = getCellState(board, { x, y });
      if (state === cellState && !visited[x][y]) {
        const shape = floodFill(board, { x, y }, cellState, visited);
        if (shape.length > 0) {
          shapes.push(shape);
        }
      }
    }
  }

  return shapes;
}

/**
 * Flood-fill to find a connected region of cells.
 */
function floodFill(
  board: Board,
  start: Point,
  targetState: CellState,
  visited: boolean[][]
): Shape {
  const shape: Point[] = [];
  const stack: Point[] = [start];

  const minBound: Point = { x: 0, y: 0 };
  const maxBound: Point = { x: GRID.WIDTH - 1, y: GRID.HEIGHT - 1 };

  while (stack.length > 0) {
    const current = stack.pop()!;
    const { x, y } = current;

    // Skip if already visited or out of bounds
    if (
      x < 0 ||
      x >= GRID.WIDTH ||
      y < 0 ||
      y >= GRID.HEIGHT ||
      visited[x][y]
    ) {
      continue;
    }

    const currentState = getCellState(board, current);
    if (currentState !== targetState) {
      continue;
    }

    visited[x][y] = true;
    shape.push(current);

    // Add all valid neighbors to stack
    const neighbors = getValidNeighbors(current, minBound, maxBound);
    stack.push(...neighbors);
  }

  return shape;
}

/**
 * Check if a shape matches the target gem.
 * Compares normalized (origin-aligned) versions of both shapes.
 */
export function isTargetGem(shape: Shape, targetGem: Shape): boolean {
  return shapesEqual(shape, targetGem);
}

/**
 * Find all gems (shapes matching the target) on the board.
 * Returns both the matching gems and all light-colored shapes found.
 */
export function findGemsAndShapes(
  board: Board,
  targetGem: Shape
): { gems: Shape[]; shapes: Shape[] } {
  // Find all connected light-colored regions
  const shapes = findShapes(board, 'light');

  // Check which shapes match the target gem
  const gems = shapes.filter((shape) => isTargetGem(shape, targetGem));

  return { gems, shapes };
}

/**
 * Calculate the bounding box of a shape.
 */
export function getShapeBounds(shape: Shape): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (shape.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0, width: 0, height: 0 };
  }

  const minX = Math.min(...shape.map((p) => p.x));
  const maxX = Math.max(...shape.map((p) => p.x));
  const minY = Math.min(...shape.map((p) => p.y));
  const maxY = Math.max(...shape.map((p) => p.y));

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Calculate offset to center a gem in the target display area.
 */
export function getCenterOffset(shape: Shape): Point {
  const bounds = getShapeBounds(shape);
  const offsetX = Math.floor((MAX_GEM_SIZE - bounds.width) / 2);
  const offsetY = Math.floor((MAX_GEM_SIZE - bounds.height) / 2);
  return { x: offsetX, y: offsetY };
}

/**
 * Get gem cells with offset applied for centered display.
 */
export function getCenteredGemCells(shape: Shape): Point[] {
  const offset = getCenterOffset(shape);
  return shape.map((p) => ({ x: p.x + offset.x, y: p.y + offset.y }));
}
