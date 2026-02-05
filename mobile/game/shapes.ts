/**
 * Shape definitions with rotations.
 * Ported from Shapes.gd - each shape has 4 rotations.
 * Coordinates are relative positions from the player's current position.
 */

import type { Point, Shape, ShapeName } from './types';

// Helper to create Point objects
const p = (x: number, y: number): Point => ({ x, y });

/**
 * Upper L shape (I-shape, 3 cells)
 * 2 unique rotations, mirrored for 4 total
 */
const UPPER_L_ROT_0: Shape = [p(0, 1), p(1, 1), p(2, 1)];
const UPPER_L_ROT_1: Shape = [p(1, 0), p(1, 1), p(1, 2)];
const UPPER_L: Shape[] = [
  UPPER_L_ROT_0,
  UPPER_L_ROT_1,
  UPPER_L_ROT_0,
  UPPER_L_ROT_1,
];

/**
 * Square shape (2x2, 4 cells)
 * Same for all rotations
 */
const SQUARE_ROT_0: Shape = [p(0, 0), p(0, 1), p(1, 0), p(1, 1)];
const SQUARE: Shape[] = [SQUARE_ROT_0, SQUARE_ROT_0, SQUARE_ROT_0, SQUARE_ROT_0];

/**
 * U shape (5 cells)
 * 4 unique rotations
 */
const U_ROT_0: Shape = [p(0, 0), p(0, 1), p(1, 0), p(2, 0), p(2, 1)];
const U_ROT_1: Shape = [p(0, 0), p(0, 1), p(0, 2), p(1, 0), p(1, 2)];
const U_ROT_2: Shape = [p(0, 1), p(0, 2), p(1, 2), p(2, 1), p(2, 2)];
const U_ROT_3: Shape = [p(1, 0), p(1, 2), p(2, 0), p(2, 1), p(2, 2)];
const U: Shape[] = [U_ROT_0, U_ROT_1, U_ROT_2, U_ROT_3];

/**
 * Lower Z shape (S-shape, 4 cells)
 * 2 unique rotations, mirrored for 4 total
 */
const LOWER_Z_ROT_0: Shape = [p(0, 0), p(0, 1), p(1, 1), p(1, 2)];
const LOWER_Z_ROT_1: Shape = [p(0, 1), p(1, 0), p(1, 1), p(2, 0)];
const LOWER_Z: Shape[] = [
  LOWER_Z_ROT_0,
  LOWER_Z_ROT_1,
  LOWER_Z_ROT_0,
  LOWER_Z_ROT_1,
];

/**
 * Upper Z shape (5 cells)
 * 2 unique rotations, mirrored for 4 total
 */
const UPPER_Z_ROT_0: Shape = [p(0, 0), p(0, 1), p(1, 1), p(2, 1), p(2, 2)];
const UPPER_Z_ROT_1: Shape = [p(0, 2), p(1, 0), p(1, 1), p(1, 2), p(2, 0)];
const UPPER_Z: Shape[] = [
  UPPER_Z_ROT_0,
  UPPER_Z_ROT_1,
  UPPER_Z_ROT_0,
  UPPER_Z_ROT_1,
];

/**
 * W shape (staircase, 5 cells)
 * 4 unique rotations
 */
const W_ROT_0: Shape = [p(2, 0), p(2, 1), p(1, 1), p(1, 2), p(0, 2)];
const W_ROT_1: Shape = [p(2, 2), p(1, 2), p(1, 1), p(0, 1), p(0, 0)];
const W_ROT_2: Shape = [p(0, 2), p(0, 1), p(1, 1), p(1, 0), p(2, 0)];
const W_ROT_3: Shape = [p(0, 0), p(1, 0), p(1, 1), p(2, 1), p(2, 2)];
const W: Shape[] = [W_ROT_0, W_ROT_1, W_ROT_2, W_ROT_3];

/**
 * T shape (5 cells)
 * 4 unique rotations
 */
const T_ROT_0: Shape = [p(2, 0), p(2, 1), p(1, 1), p(0, 1), p(2, 2)];
const T_ROT_1: Shape = [p(2, 2), p(1, 2), p(1, 1), p(1, 0), p(0, 2)];
const T_ROT_2: Shape = [p(0, 2), p(0, 1), p(1, 1), p(2, 1), p(0, 0)];
const T_ROT_3: Shape = [p(0, 0), p(1, 0), p(1, 1), p(1, 2), p(2, 0)];
const T: Shape[] = [T_ROT_0, T_ROT_1, T_ROT_2, T_ROT_3];

/**
 * Dictionary of all shapes indexed by name.
 * Each shape is an array of 4 rotations.
 */
export const SHAPES: Record<ShapeName, Shape[]> = {
  upper_l: UPPER_L,
  square: SQUARE,
  u: U,
  lower_z: LOWER_Z,
  upper_z: UPPER_Z,
  w: W,
  t: T,
};

/**
 * Array of all shape names for iteration.
 */
export const SHAPE_NAMES: ShapeName[] = [
  'upper_l',
  'square',
  'u',
  'lower_z',
  'upper_z',
  'w',
  't',
];

/**
 * Get a specific rotation of a shape.
 * @param shapeName - The name of the shape
 * @param rotationIndex - The rotation index (0-3)
 * @returns The shape cells for that rotation
 */
export function getShapeRotation(
  shapeName: ShapeName,
  rotationIndex: number
): Shape {
  const normalizedIndex = rotationIndex % 4;
  return SHAPES[shapeName][normalizedIndex];
}

/**
 * Get all rotations for a shape.
 * @param shapeName - The name of the shape
 * @returns Array of 4 rotations
 */
export function getShapeRotations(shapeName: ShapeName): Shape[] {
  return SHAPES[shapeName];
}
