/**
 * Board state management.
 * Handles the 13x13 game grid.
 */

import { GRID } from '../constants';
import type { Board, CellState, Point } from '../types';
import { deepClone } from './utils';

/**
 * Create an empty board with all cells set to 'empty'.
 */
export function createEmptyBoard(): Board {
  const board: Board = [];
  for (let x = 0; x < GRID.WIDTH; x++) {
    board[x] = [];
    for (let y = 0; y < GRID.HEIGHT; y++) {
      board[x][y] = 'empty';
    }
  }
  return board;
}

/**
 * Clear all cells on the board to 'empty'.
 */
export function clearBoard(board: Board): Board {
  const newBoard = createEmptyBoard();
  return newBoard;
}

/**
 * Get the state of a cell at the given position.
 * Returns 'empty' for out-of-bounds positions.
 */
export function getCellState(board: Board, point: Point): CellState {
  if (
    point.x < 0 ||
    point.x >= GRID.WIDTH ||
    point.y < 0 ||
    point.y >= GRID.HEIGHT
  ) {
    return 'empty';
  }
  return board[point.x][point.y];
}

/**
 * Set the state of a cell at the given position.
 * Returns a new board with the updated cell.
 */
export function setCellState(
  board: Board,
  point: Point,
  state: CellState
): Board {
  if (
    point.x < 0 ||
    point.x >= GRID.WIDTH ||
    point.y < 0 ||
    point.y >= GRID.HEIGHT
  ) {
    return board;
  }

  const newBoard = cloneBoard(board);
  newBoard[point.x][point.y] = state;
  return newBoard;
}

/**
 * Check if a position is outside the valid board area (border).
 */
export function isCellBorder(point: Point): boolean {
  return (
    point.x < 0 ||
    point.x >= GRID.WIDTH ||
    point.y < 0 ||
    point.y >= GRID.HEIGHT
  );
}

/**
 * Create a deep copy of the board.
 */
export function cloneBoard(board: Board): Board {
  return deepClone(board);
}

/**
 * Convert board to a serializable array format for saving.
 */
export function boardToArray(board: Board): CellState[][] {
  return deepClone(board);
}

/**
 * Restore board from a saved array format.
 */
export function arrayToBoard(array: CellState[][]): Board {
  // Validate dimensions
  if (array.length !== GRID.WIDTH) {
    console.warn('Invalid board width, creating empty board');
    return createEmptyBoard();
  }

  for (let x = 0; x < GRID.WIDTH; x++) {
    if (!array[x] || array[x].length !== GRID.HEIGHT) {
      console.warn('Invalid board height, creating empty board');
      return createEmptyBoard();
    }
  }

  return deepClone(array);
}

/**
 * Toggle the cell state when a shape is placed.
 * - empty -> dark
 * - dark -> light
 * - light -> dark
 */
export function toggleCellState(currentState: CellState): CellState {
  switch (currentState) {
    case 'empty':
      return 'dark';
    case 'dark':
      return 'light';
    case 'light':
      return 'dark';
  }
}

/**
 * Get the display state for a cell when the player shape is over it.
 * This determines what color to show for the "preview" of placement.
 * - empty -> dark (active)
 * - dark -> light (active)
 * - light -> dark (active)
 */
export function getPlayerOverlayState(currentState: CellState): CellState {
  // The overlay shows what the cell WILL become, which is the toggled state
  return toggleCellState(currentState);
}

/**
 * Count cells of a specific state on the board.
 */
export function countCells(board: Board, state: CellState): number {
  let count = 0;
  for (let x = 0; x < GRID.WIDTH; x++) {
    for (let y = 0; y < GRID.HEIGHT; y++) {
      if (board[x][y] === state) {
        count++;
      }
    }
  }
  return count;
}

/**
 * Get all positions of cells with a specific state.
 */
export function getCellsWithState(board: Board, state: CellState): Point[] {
  const cells: Point[] = [];
  for (let x = 0; x < GRID.WIDTH; x++) {
    for (let y = 0; y < GRID.HEIGHT; y++) {
      if (board[x][y] === state) {
        cells.push({ x, y });
      }
    }
  }
  return cells;
}
