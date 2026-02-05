/**
 * Queue management for shape distribution.
 * Handles the sequence of upcoming shapes.
 */

import { VISIBLE_QUEUE_SIZE } from '../constants';
import { SHAPE_NAMES } from '../shapes';
import type { QueueState, ShapeName } from '../types';
import { SeededRandom } from './utils';

/**
 * Options for creating a new queue.
 */
export interface QueueOptions {
  /** Seed for random generation (null for unseeded/Math.random) */
  seed?: number | null;
  /** Number of shapes to keep visible in queue */
  visibleSize?: number;
  /** Whether to auto-fill queue with random shapes */
  shouldFill?: boolean;
  /** Initial queue contents (for puzzle mode) */
  initialQueue?: ShapeName[];
}

/**
 * Create a new queue with the given options.
 */
export function createQueue(options: QueueOptions = {}): QueueState {
  const {
    seed = null,
    visibleSize = VISIBLE_QUEUE_SIZE,
    shouldFill = true,
    initialQueue = [],
  } = options;

  const queue: QueueState = {
    queue: [...initialQueue],
    history: [],
    currentPiece: null,
    seed,
    visibleSize,
    shouldFill,
  };

  // Fill the queue if auto-fill is enabled
  if (shouldFill) {
    return fillQueue(queue);
  }

  return queue;
}

/**
 * Fill the queue with random shapes until it reaches the visible size.
 */
export function fillQueue(queueState: QueueState): QueueState {
  if (!queueState.shouldFill) {
    return queueState;
  }

  const newQueue = [...queueState.queue];
  const rng =
    queueState.seed !== null
      ? new SeededRandom(queueState.seed + newQueue.length)
      : null;

  while (newQueue.length <= queueState.visibleSize) {
    const shapeName = rng
      ? rng.randomItem(SHAPE_NAMES)
      : SHAPE_NAMES[Math.floor(Math.random() * SHAPE_NAMES.length)];
    newQueue.push(shapeName);
  }

  return {
    ...queueState,
    queue: newQueue,
  };
}

/**
 * Get the next shape from the queue.
 * Returns the shape and updated queue state.
 */
export function next(
  queueState: QueueState
): { shape: ShapeName | null; queue: QueueState } {
  if (queueState.queue.length === 0) {
    return { shape: null, queue: queueState };
  }

  const [nextShape, ...remainingQueue] = queueState.queue;

  // Add current piece to history if it exists
  const newHistory = queueState.currentPiece
    ? [...queueState.history, queueState.currentPiece]
    : queueState.history;

  let newState: QueueState = {
    ...queueState,
    queue: remainingQueue,
    history: newHistory,
    currentPiece: nextShape,
  };

  // Refill if auto-fill is enabled
  if (queueState.shouldFill) {
    newState = fillQueue(newState);
  }

  return { shape: nextShape, queue: newState };
}

/**
 * Undo: push a shape back to the front of the queue.
 */
export function undo(
  queueState: QueueState,
  shapeName: ShapeName
): QueueState {
  return {
    ...queueState,
    queue: [shapeName, ...queueState.queue],
  };
}

/**
 * Get the current queue contents.
 */
export function getQueue(queueState: QueueState): ShapeName[] {
  return [...queueState.queue];
}

/**
 * Get the number of shapes in the queue.
 */
export function getQueueSize(queueState: QueueState): number {
  return queueState.queue.length;
}

/**
 * Load queue from saved data.
 */
export function loadQueue(
  queueState: QueueState,
  data: ShapeName[]
): QueueState {
  return {
    ...queueState,
    queue: [...data],
  };
}

/**
 * Get visible portion of the queue (for display).
 */
export function getVisibleQueue(queueState: QueueState): ShapeName[] {
  return queueState.queue.slice(0, queueState.visibleSize);
}

/**
 * Check if the queue is empty.
 */
export function isEmpty(queueState: QueueState): boolean {
  return queueState.queue.length === 0;
}

/**
 * Append a shape to the end of the queue.
 * Used for fixed queues in puzzle/challenge modes.
 */
export function appendToQueue(
  queueState: QueueState,
  shapeName: ShapeName
): QueueState {
  return {
    ...queueState,
    queue: [...queueState.queue, shapeName],
  };
}

/**
 * Create a queue state from save data.
 */
export function queueFromSave(
  savedQueue: ShapeName[],
  options: QueueOptions = {}
): QueueState {
  const baseQueue = createQueue({ ...options, shouldFill: false });
  return {
    ...baseQueue,
    queue: [...savedQueue],
    shouldFill: options.shouldFill ?? true,
  };
}
