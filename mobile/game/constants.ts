/**
 * Game constants matching the desktop Godot implementation.
 * Ported from GlobalConsts.gd
 */

import type { Direction, Point, SaveSlot } from './types';

/**
 * Grid dimensions for the game board.
 */
export const GRID = {
  WIDTH: 13,
  HEIGHT: 13,
} as const;

/**
 * Board origin position (top-left corner).
 */
export const BOARD_ORIGIN: Point = { x: 0, y: 0 };

/**
 * Board end position (bottom-right corner, exclusive).
 */
export const BOARD_END: Point = {
  x: BOARD_ORIGIN.x + GRID.WIDTH,
  y: BOARD_ORIGIN.y + GRID.HEIGHT,
};

/**
 * Starting position for new shapes.
 */
export const STARTING_POSITION: Point = { x: 5, y: 5 };

/**
 * Maximum gem size for target gem display area.
 */
export const MAX_GEM_SIZE = 6;

/**
 * Maximum player shape size (for bounding calculations).
 */
export const MAX_PLAYER_SIZE = 3;

/**
 * Total number of rotations per shape.
 */
export const TOTAL_ROTATIONS = 4;

/**
 * Number of shapes visible in the queue display.
 */
export const VISIBLE_QUEUE_SIZE = 3;

/**
 * Available save slots.
 */
export const GAME_SLOTS: SaveSlot[] = ['A', 'B', 'C', 'D'];

/**
 * Game mode identifiers.
 */
export const GAME_MODE = {
  Tutorial: 'tutorial',
  FreePlay: 'freeplay',
  Daily: 'daily',
  Puzzle: 'puzzle',
} as const;

/**
 * Input action identifiers.
 */
export const ACTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
  ROTATE: 'rotate',
  UNDO: 'undo',
  SELECT: 'select',
  ESCAPE: 'escape',
} as const;

/**
 * Direction vectors for movement.
 */
export const DIRECTION_VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/**
 * Cell state colors for rendering.
 * These match the sprite atlas coordinates from the desktop version.
 */
export const CELL_COLORS = {
  EMPTY: { x: -1, y: -1 },
  DARK_INACTIVE: { x: 0, y: 0 },
  DARK_ACTIVE: { x: 1, y: 0 },
  LIGHT_INACTIVE: { x: 2, y: 0 },
  LIGHT_ACTIVE: { x: 3, y: 0 },
  BORDER: { x: 4, y: 0 },
  GEM_INACTIVE: { x: 5, y: 0 },
  GEM_ACTIVE: { x: 6, y: 0 },
} as const;

/**
 * Save file section names.
 */
export const SAVE_SECTIONS = {
  Metadata: 'metadata',
  PuzzleLevelScores: 'puzzle_level_scores',
} as const;

/**
 * Free Play mode save metadata keys.
 */
export const FREE_PLAY_SAVE_KEYS = {
  LEVEL: 'level',
  ALCHEMIZATIONS: 'alchemizations',
  QUEUE: 'queue',
  GAME_START_TIMESTAMP: 'game_start_timestamp',
  HISTORY: 'history',
  SHAPE_NAME: 'player_shape',
  PLACED_SHAPES: 'placed_shapes',
  BLOCKERS: 'blockers',
  TARGET_GEM: 'target_gem',
} as const;

/**
 * Puzzle mode save metadata keys.
 */
export const PUZZLE_SAVE_KEYS = {
  MAX_AVAILABLE_WORLD_NUMBER: 'max_available_world_number',
  MAX_AVAILABLE_LEVEL_NUMBER: 'max_available_level_number',
} as const;

/**
 * Daily mode save metadata keys.
 */
export const DAILY_SAVE_KEYS = {
  BEST_SCORES: 'best_scores',
} as const;

/**
 * Puzzle level data keys.
 */
export const PUZZLE_LEVEL_KEYS = {
  QUEUE: 'queue',
  TARGET_GEM: 'target_gem',
} as const;

/**
 * AsyncStorage key prefixes for persistence.
 */
export const STORAGE_KEYS = {
  FREE_PLAY_SAVE: 'freeplay_save',
  PUZZLE_SAVE: 'puzzle_save',
  DAILY_SAVE: 'daily_save',
  SETTINGS: 'settings',
  FIRST_TIME: 'first_time',
} as const;

/**
 * Tutorial instruction stage identifiers.
 */
export const TUTORIAL_STAGES = {
  MOVE: 0,
  PLACE: 1,
  STACK: 2,
  UNDO: 3,
  SCORE: 4,
  QUEUE: 5,
  DONE: 6,
} as const;

/**
 * Tutorial stage names for display/reference.
 */
export const TUTORIAL_STAGE_NAMES = [
  '0_Move',
  '1_Place',
  '2_Stack',
  '3_Undo',
  '4_Score',
  '5_Queue',
  '6_Done',
] as const;

/**
 * Audio track names.
 */
export const AUDIO_TRACKS = {
  GAMEPLAY: 'gameplay',
} as const;

/**
 * Sound effect names.
 */
export const SOUND_EFFECTS = {
  MOVEMENT: 'movement',
  NON_MOVEMENT: 'non_movement',
  ONE_GEM: 'one_gem',
  TWO_GEMS: 'two_gems',
} as const;

/**
 * Timing constants (in milliseconds).
 */
export const TIMING = {
  LEVEL_COMPLETE_DELAY: 1000,
  GAME_COMPLETE_DELAY: 1000,
  GAME_OVER_DELAY: 1000,
  TUTORIAL_LEVEL_DELAY: 2000,
} as const;
