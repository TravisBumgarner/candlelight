/**
 * History management for undo functionality.
 * Stores board snapshots before each placement.
 */

import type { Board, HistoryRecord, ShapeName } from '../types';
import { cloneBoard } from './board';
import { deepClone } from './utils';

/**
 * Create an empty history.
 */
export function createHistory(): HistoryRecord[] {
  return [];
}

/**
 * Push a new record to the history.
 * Stores the board state BEFORE a placement is made.
 */
export function push(
  history: HistoryRecord[],
  board: Board,
  shapeName: ShapeName
): HistoryRecord[] {
  const record: HistoryRecord = {
    board: cloneBoard(board),
    shapeName,
  };
  return [...history, record];
}

/**
 * Pop and return the last record from history.
 * Returns null if history is empty.
 */
export function pop(
  history: HistoryRecord[]
): { record: HistoryRecord | null; history: HistoryRecord[] } {
  if (history.length === 0) {
    return { record: null, history };
  }

  const newHistory = history.slice(0, -1);
  const record = history[history.length - 1];

  return {
    record: {
      board: cloneBoard(record.board),
      shapeName: record.shapeName,
    },
    history: newHistory,
  };
}

/**
 * Clear all history records.
 */
export function clear(): HistoryRecord[] {
  return [];
}

/**
 * Get the size of the history.
 */
export function size(history: HistoryRecord[]): number {
  return history.length;
}

/**
 * Check if history is empty.
 */
export function isEmpty(history: HistoryRecord[]): boolean {
  return history.length === 0;
}

/**
 * Get a copy of the full history.
 */
export function getHistory(history: HistoryRecord[]): HistoryRecord[] {
  return deepClone(history);
}

/**
 * Load history from saved data.
 */
export function loadHistory(data: HistoryRecord[]): HistoryRecord[] {
  return deepClone(data);
}

/**
 * Get the last record without removing it.
 */
export function peek(history: HistoryRecord[]): HistoryRecord | null {
  if (history.length === 0) {
    return null;
  }
  const record = history[history.length - 1];
  return {
    board: cloneBoard(record.board),
    shapeName: record.shapeName,
  };
}

/**
 * Serialize history for saving.
 * Returns a plain object that can be JSON.stringify'd.
 */
export function historyToSave(history: HistoryRecord[]): HistoryRecord[] {
  return deepClone(history);
}

/**
 * Restore history from save data.
 */
export function historyFromSave(data: HistoryRecord[]): HistoryRecord[] {
  return deepClone(data);
}
