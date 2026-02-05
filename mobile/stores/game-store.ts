/**
 * Zustand store for game state management.
 */

import { create } from 'zustand';
import type {
  Board,
  Direction,
  GameMode,
  GameState,
  HistoryRecord,
  PlayerState,
  Point,
  QueueState,
  Shape,
  ShapeName,
} from '@/game/types';
import {
  createEmptyBoard,
  clearBoard,
  cloneBoard,
  createPlayer,
  canMove,
  move,
  canRotate,
  rotate,
  canPlace,
  placeOnBoard,
  getPlayerOverlay,
  createQueue,
  nextFromQueue,
  undoQueue,
  createHistory,
  pushHistory,
  popHistory,
  isHistoryEmpty,
  findGemsAndShapes,
  freePlayModeGenerateGem,
} from '@/game/engine';
import { STARTING_POSITION } from '@/game/constants';

interface GameStore {
  // State
  mode: GameMode | null;
  board: Board;
  player: PlayerState | null;
  queue: QueueState | null;
  history: HistoryRecord[];
  targetGem: Shape;
  level: number;
  worldNumber: number;
  alchemizations: number;
  bestScore: number | null;
  isPaused: boolean;
  isInteractionDisabled: boolean;
  isLevelComplete: boolean;
  isGameOver: boolean;
  isGameComplete: boolean;
  matchedGems: Shape[];

  // Computed
  getPlayerCells: () => { point: Point; state: 'dark' | 'light' }[];

  // Actions
  initGame: (mode: GameMode, options?: GameInitOptions) => void;
  movePlayer: (direction: Direction) => boolean;
  rotatePlayer: () => boolean;
  placeShape: () => boolean;
  undo: () => boolean;
  pause: () => void;
  resume: () => void;
  nextLevel: () => void;
  restartLevel: () => void;
  reset: () => void;
}

interface GameInitOptions {
  level?: number;
  worldNumber?: number;
  targetGem?: Shape;
  queue?: ShapeName[];
  seed?: number | null;
  bestScore?: number | null;
}

const initialState = {
  mode: null as GameMode | null,
  board: createEmptyBoard(),
  player: null as PlayerState | null,
  queue: null as QueueState | null,
  history: [] as HistoryRecord[],
  targetGem: [] as Shape,
  level: 1,
  worldNumber: 1,
  alchemizations: 0,
  bestScore: null as number | null,
  isPaused: false,
  isInteractionDisabled: false,
  isLevelComplete: false,
  isGameOver: false,
  isGameComplete: false,
  matchedGems: [] as Shape[],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  getPlayerCells: () => {
    const { player, board } = get();
    if (!player) return [];
    return getPlayerOverlay(player, board);
  },

  initGame: (mode, options = {}) => {
    const {
      level = 1,
      worldNumber = 1,
      targetGem,
      queue: initialQueue,
      seed = null,
      bestScore = null,
    } = options;

    const board = createEmptyBoard();

    // Create queue based on mode
    const queue = createQueue({
      seed,
      shouldFill: mode !== 'puzzle',
      initialQueue: initialQueue ?? [],
    });

    // Get first shape from queue
    const { shape: firstShape, queue: updatedQueue } = nextFromQueue(queue);

    // Create player with first shape
    const player = firstShape ? createPlayer(firstShape) : null;

    // Generate or use provided target gem
    const gem = targetGem ?? freePlayModeGenerateGem(level);

    set({
      mode,
      board,
      player,
      queue: updatedQueue,
      history: createHistory(),
      targetGem: gem,
      level,
      worldNumber,
      alchemizations: 0,
      bestScore,
      isPaused: false,
      isInteractionDisabled: false,
      isLevelComplete: false,
      isGameOver: false,
      isGameComplete: false,
      matchedGems: [],
    });
  },

  movePlayer: (direction) => {
    const { player, board, isInteractionDisabled } = get();
    if (!player || isInteractionDisabled) return false;

    if (canMove(player, board, direction)) {
      set({ player: move(player, direction) });
      return true;
    }
    return false;
  },

  rotatePlayer: () => {
    const { player, board, isInteractionDisabled } = get();
    if (!player || isInteractionDisabled) return false;

    if (canRotate(player, board)) {
      set({ player: rotate(player) });
      return true;
    }
    return false;
  },

  placeShape: () => {
    const { player, board, queue, history, targetGem, alchemizations, isInteractionDisabled } =
      get();
    if (!player || !queue || isInteractionDisabled) return false;

    if (!canPlace(player, board)) {
      return false;
    }

    // Save history before placement
    const newHistory = pushHistory(history, board, player.shapeName);

    // Place shape on board
    const newBoard = placeOnBoard(player, board);
    const newAlchemizations = alchemizations + 1;

    // Check for gem matches
    const { gems } = findGemsAndShapes(newBoard, targetGem);

    if (gems.length > 0) {
      // Level complete!
      set({
        board: newBoard,
        history: newHistory,
        alchemizations: newAlchemizations,
        isLevelComplete: true,
        isInteractionDisabled: true,
        matchedGems: gems,
      });
      return true;
    }

    // Get next shape from queue
    const { shape: nextShape, queue: updatedQueue } = nextFromQueue(queue);

    if (!nextShape) {
      // Queue exhausted - game over (puzzle mode)
      set({
        board: newBoard,
        history: newHistory,
        alchemizations: newAlchemizations,
        player: null,
        queue: updatedQueue,
        isGameOver: true,
        isInteractionDisabled: true,
      });
      return true;
    }

    // Continue with next shape
    set({
      board: newBoard,
      history: newHistory,
      alchemizations: newAlchemizations,
      player: createPlayer(nextShape),
      queue: updatedQueue,
    });

    return true;
  },

  undo: () => {
    const { history, player, queue, alchemizations, isInteractionDisabled } = get();
    if (isHistoryEmpty(history) || isInteractionDisabled) return false;

    const { record, history: newHistory } = popHistory(history);
    if (!record || !queue) return false;

    // Restore board and put current shape back in queue
    const newQueue = player?.shapeName
      ? undoQueue(queue, player.shapeName)
      : queue;

    set({
      board: record.board,
      history: newHistory,
      player: createPlayer(record.shapeName),
      queue: newQueue,
      alchemizations: Math.max(0, alchemizations - 1),
    });

    return true;
  },

  pause: () => {
    set({ isPaused: true, isInteractionDisabled: true });
  },

  resume: () => {
    set({ isPaused: false, isInteractionDisabled: false });
  },

  nextLevel: () => {
    const { mode, level, worldNumber, queue } = get();
    if (!mode || !queue) return;

    const newLevel = level + 1;
    const newBoard = createEmptyBoard();
    const newGem = freePlayModeGenerateGem(newLevel);

    // Get next shape
    const { shape: nextShape, queue: updatedQueue } = nextFromQueue(queue);
    const newPlayer = nextShape ? createPlayer(nextShape) : null;

    set({
      board: newBoard,
      player: newPlayer,
      queue: updatedQueue,
      history: createHistory(),
      targetGem: newGem,
      level: newLevel,
      alchemizations: 0,
      isLevelComplete: false,
      isInteractionDisabled: false,
      matchedGems: [],
    });
  },

  restartLevel: () => {
    const { mode, level, worldNumber, targetGem, bestScore } = get();
    if (!mode) return;

    get().initGame(mode, {
      level,
      worldNumber,
      targetGem,
      bestScore,
    });
  },

  reset: () => {
    set(initialState);
  },
}));

export default useGameStore;
