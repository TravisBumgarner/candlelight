/**
 * Player state and movement logic.
 * Handles the current shape being controlled by the player.
 */

import {
  STARTING_POSITION,
  TOTAL_ROTATIONS,
  DIRECTION_VECTORS,
} from '../constants';
import { getShapeRotation } from '../shapes';
import type { Board, Direction, PlayerState, Point, ShapeName } from '../types';
import {
  getCellState,
  isCellBorder,
  setCellState,
  toggleCellState,
  cloneBoard,
} from './board';
import { addPoints } from './utils';

/**
 * Create a new player state with the given shape at the starting position.
 */
export function createPlayer(shapeName: ShapeName): PlayerState {
  return {
    position: { ...STARTING_POSITION },
    shapeName,
    rotationIndex: 0,
  };
}

/**
 * Get the current shape cells in relative coordinates.
 */
export function getCurrentShapeRotation(player: PlayerState): Point[] {
  return getShapeRotation(player.shapeName, player.rotationIndex);
}

/**
 * Get the current shape cells in absolute board coordinates.
 */
export function getAbsoluteShapeCells(player: PlayerState): Point[] {
  const relativeCells = getCurrentShapeRotation(player);
  return relativeCells.map((cell) => addPoints(player.position, cell));
}

/**
 * Check if the player can move in the given direction.
 */
export function canMove(
  player: PlayerState,
  board: Board,
  direction: Direction
): boolean {
  const directionVector = DIRECTION_VECTORS[direction];
  const newPosition = addPoints(player.position, directionVector);

  // Check each cell of the shape at the new position
  const shapeCells = getCurrentShapeRotation(player);
  for (const cell of shapeCells) {
    const absoluteCell = addPoints(newPosition, cell);
    if (isCellBorder(absoluteCell)) {
      return false;
    }
  }

  return true;
}

/**
 * Move the player in the given direction.
 * Returns a new player state with updated position.
 * Does not validate - call canMove first.
 */
export function move(player: PlayerState, direction: Direction): PlayerState {
  const directionVector = DIRECTION_VECTORS[direction];
  return {
    ...player,
    position: addPoints(player.position, directionVector),
  };
}

/**
 * Check if the player can rotate clockwise.
 */
export function canRotate(player: PlayerState, board: Board): boolean {
  const newRotationIndex = (player.rotationIndex + 1) % TOTAL_ROTATIONS;
  const newShapeCells = getShapeRotation(player.shapeName, newRotationIndex);

  // Check each cell of the rotated shape
  for (const cell of newShapeCells) {
    const absoluteCell = addPoints(player.position, cell);
    if (isCellBorder(absoluteCell)) {
      return false;
    }
  }

  return true;
}

/**
 * Rotate the player's shape clockwise.
 * Returns a new player state with updated rotation.
 * Does not validate - call canRotate first.
 */
export function rotate(player: PlayerState): PlayerState {
  return {
    ...player,
    rotationIndex: (player.rotationIndex + 1) % TOTAL_ROTATIONS,
  };
}

/**
 * Check if the player can place the shape at the current position.
 * Shape cannot be placed on border cells or blocker cells.
 */
export function canPlace(player: PlayerState, board: Board): boolean {
  const shapeCells = getAbsoluteShapeCells(player);

  for (const cell of shapeCells) {
    // Cannot place on border
    if (isCellBorder(cell)) {
      return false;
    }
    // Note: Blocker cells not implemented in current game modes
    // but could be added here for future use
  }

  return true;
}

/**
 * Place the player's shape on the board.
 * Toggles the cell states where the shape is placed.
 * Returns the updated board.
 * Does not validate - call canPlace first.
 */
export function placeOnBoard(player: PlayerState, board: Board): Board {
  let newBoard = cloneBoard(board);
  const shapeCells = getAbsoluteShapeCells(player);

  for (const cell of shapeCells) {
    const currentState = getCellState(newBoard, cell);
    const newState = toggleCellState(currentState);
    newBoard = setCellState(newBoard, cell, newState);
  }

  return newBoard;
}

/**
 * Get the overlay states for displaying the player's shape preview.
 * Returns an array of { point, state } pairs showing what each cell
 * will look like if the shape is placed.
 */
export function getPlayerOverlay(
  player: PlayerState,
  board: Board
): { point: Point; state: 'dark' | 'light' }[] {
  const shapeCells = getAbsoluteShapeCells(player);
  return shapeCells.map((cell) => {
    const currentState = getCellState(board, cell);
    // Determine what the cell will become (toggled state)
    const overlayState = toggleCellState(currentState);
    return {
      point: cell,
      state: overlayState === 'empty' ? 'dark' : overlayState,
    };
  });
}

/**
 * Check if any part of the shape is in an invalid position.
 * Used for visual feedback when shape cannot be placed.
 */
export function isInvalidPosition(player: PlayerState, board: Board): boolean {
  return !canPlace(player, board);
}
