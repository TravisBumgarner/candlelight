/**
 * Core type definitions for the Candlelight mobile game.
 * These types mirror the data structures used in the Godot desktop version.
 */

/**
 * 2D point representing a grid position.
 * Equivalent to Godot's Vector2i.
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Direction for player movement.
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * The 7 available shape types in the game.
 * Each shape has 4 rotations.
 */
export type ShapeName =
  | 'upper_l'
  | 'square'
  | 'u'
  | 'lower_z'
  | 'upper_z'
  | 'w'
  | 't';

/**
 * State of a cell on the game board.
 * - empty: No shape has been placed
 * - dark: Shape placed (first layer)
 * - light: Shape placed on top of dark (stacked/toggled)
 */
export type CellState = 'empty' | 'dark' | 'light';

/**
 * The game board represented as a 2D grid of cell states.
 * Board is GRID.WIDTH x GRID.HEIGHT (13x13).
 */
export type Board = CellState[][];

/**
 * A shape represented as an array of relative positions.
 * Each position is relative to the player's current position.
 */
export type Shape = Point[];

/**
 * Available game modes.
 */
export type GameMode = 'tutorial' | 'freeplay' | 'daily' | 'puzzle';

/**
 * Player action types for input handling.
 */
export type Action =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'rotate'
  | 'select'
  | 'undo'
  | 'escape';

/**
 * Current state of the player (active shape being controlled).
 */
export interface PlayerState {
  /** Current position on the board (absolute coordinates) */
  position: Point;
  /** Name of the current shape */
  shapeName: ShapeName;
  /** Current rotation index (0-3) */
  rotationIndex: number;
}

/**
 * A record in the move history for undo functionality.
 * Stores the board state before a placement was made.
 */
export interface HistoryRecord {
  /** Board state before the placement */
  board: Board;
  /** Shape that was placed */
  shapeName: ShapeName;
}

/**
 * State of the shape queue.
 */
export interface QueueState {
  /** Shapes waiting to be played */
  queue: ShapeName[];
  /** History of shapes that have been played */
  history: ShapeName[];
  /** Current shape being played (popped from queue) */
  currentPiece: ShapeName | null;
  /** Seed for random generation (null for unseeded) */
  seed: number | null;
  /** Number of shapes to display in queue UI */
  visibleSize: number;
  /** Whether to auto-fill queue with random shapes */
  shouldFill: boolean;
}

/**
 * Overall game state container.
 */
export interface GameState {
  /** Current game mode */
  mode: GameMode;
  /** Current board state */
  board: Board;
  /** Current player state (null if game over) */
  player: PlayerState | null;
  /** Shape queue state */
  queue: QueueState;
  /** Move history for undo */
  history: HistoryRecord[];
  /** Target gem to match */
  targetGem: Shape;
  /** Current level number */
  level: number;
  /** Current world number (puzzle mode only) */
  worldNumber: number;
  /** Number of shapes placed (score) */
  alchemizations: number;
  /** Best score for current level/day (if applicable) */
  bestScore: number | null;
  /** Whether game is paused */
  isPaused: boolean;
  /** Whether player interaction is disabled */
  isInteractionDisabled: boolean;
  /** Whether current level is complete */
  isLevelComplete: boolean;
  /** Whether game is over (puzzle mode: queue exhausted) */
  isGameOver: boolean;
  /** Timestamp when game started */
  gameStartTimestamp: number;
}

/**
 * Save slot identifier.
 */
export type SaveSlot = 'A' | 'B' | 'C' | 'D';

/**
 * Free Play mode save data structure.
 */
export interface FreePlaySave {
  level: number;
  alchemizations: number;
  queue: ShapeName[];
  gameStartTimestamp: number;
  history: HistoryRecord[];
  playerShape: ShapeName;
  board: Board;
  targetGem: Shape;
}

/**
 * Puzzle mode save data structure.
 */
export interface PuzzleSave {
  maxAvailableWorldNumber: number;
  maxAvailableLevelNumber: number;
  levelScores: Record<string, number>;
}

/**
 * Daily mode save data structure.
 */
export interface DailySave {
  bestScores: Record<string, number>;
}

/**
 * Puzzle level configuration.
 */
export interface PuzzleLevel {
  worldNumber: number;
  levelNumber: number;
  queue: ShapeName[];
  targetGem: Shape;
}

/**
 * World metadata for puzzle mode.
 */
export interface WorldMetadata {
  worldNumber: number;
  worldName: string;
  levels: {
    uniqueId: string;
    levelNumber: number;
    fileName: string;
  }[];
}
