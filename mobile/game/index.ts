/**
 * Game module exports.
 * Re-exports all types, constants, and shapes for easy importing.
 */

// Types
export type {
  Point,
  Direction,
  ShapeName,
  CellState,
  Board,
  Shape,
  GameMode,
  Action,
  PlayerState,
  HistoryRecord,
  QueueState,
  GameState,
  SaveSlot,
  FreePlaySave,
  PuzzleSave,
  DailySave,
  PuzzleLevel,
  WorldMetadata,
} from './types';

// Constants
export {
  GRID,
  BOARD_ORIGIN,
  BOARD_END,
  STARTING_POSITION,
  MAX_GEM_SIZE,
  MAX_PLAYER_SIZE,
  TOTAL_ROTATIONS,
  VISIBLE_QUEUE_SIZE,
  GAME_SLOTS,
  GAME_MODE,
  ACTION,
  DIRECTION_VECTORS,
  CELL_COLORS,
  SAVE_SECTIONS,
  FREE_PLAY_SAVE_KEYS,
  PUZZLE_SAVE_KEYS,
  DAILY_SAVE_KEYS,
  PUZZLE_LEVEL_KEYS,
  STORAGE_KEYS,
  TUTORIAL_STAGES,
  TUTORIAL_STAGE_NAMES,
  AUDIO_TRACKS,
  SOUND_EFFECTS,
  TIMING,
} from './constants';

// Shapes
export {
  SHAPES,
  SHAPE_NAMES,
  getShapeRotation,
  getShapeRotations,
} from './shapes';

// Engine (re-export all engine functions)
export * from './engine';
