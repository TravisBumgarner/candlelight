import {
  Board,
  Coordinate,
  createBoardKey,
  GamePiece,
  Shape,
  TILE_STYLES,
  TileStyle,
} from "@/types";
import { SHAPES_DICT } from "../components/shapes";

function isTargetGem(shape: Coordinate[], targetGem: Coordinate[]): boolean {
  if (shape.length !== targetGem.length) return false;

  const existingShapeAtOrigin = moveCellsToOrigin(shape);
  const targetGemAtOrigin = moveCellsToOrigin(targetGem);

  return arraysEqual(existingShapeAtOrigin, targetGemAtOrigin);
}

function moveCellsToOrigin(cells: Coordinate[]): Coordinate[] {
  const minX = Math.min(...cells.map((c) => c.x));
  const minY = Math.min(...cells.map((c) => c.y));
  return cells.map((c) => ({ x: c.x - minX, y: c.y - minY }));
}

function arraysEqual(a: Coordinate[], b: Coordinate[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((cellA) =>
    b.some((cellB) => cellA.x === cellB.x && cellA.y === cellB.y)
  );
}

function flood_fill({
  start,
  targetTileStyle,
  shape,
  board,
  visited,
  width,
  height,
}: {
  start: Coordinate;
  targetTileStyle: TileStyle;
  shape: Coordinate[];
  board: Board;
  visited: boolean[][];
  width: number;
  height: number;
}): void {
  const stack: Coordinate[] = [start];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const { x, y } = current;

    // Skip if already visited or color doesn't match
    if (
      visited[x][y] ||
      board[createBoardKey({ x, y })]?.type !== targetTileStyle
    )
      continue;

    visited[x][y] = true;
    shape.push(current);

    const neighbors = getValidNeighbors(x, y, width, height);
    stack.push(...neighbors);
  }
}

function getValidNeighbors(
  x: number,
  y: number,
  width: number,
  height: number
): Coordinate[] {
  const neighbors: Coordinate[] = [];
  const deltas = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (const [dx, dy] of deltas) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && ny >= 0 && nx < width && ny < height) {
      neighbors.push({ x: nx, y: ny });
    }
  }

  return neighbors;
}

function _find_shapes({
  width,
  height,
  targetTileStyle,
  board,
  visited,
}: {
  width: number;
  height: number;
  targetTileStyle: TileStyle;
  board: Board;
  visited: boolean[][];
}): Shape[] {
  const shapes: Shape[] = [];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const tileStyle = board[createBoardKey({ x, y })]?.type;
      if (tileStyle === targetTileStyle && !visited[x][y]) {
        const shape: Shape = [];
        flood_fill({
          start: { x, y },
          targetTileStyle,
          shape,
          board,
          visited,
          width,
          height,
        });
        if (shape.length > 0) {
          shapes.push(shape);
        }
      }
    }
  }

  return shapes;
}

export function findGemsAndShapes({
  width,
  height,
  board,
  targetGem,
}: {
  width: number;
  height: number;
  board: Board;
  targetGem: Coordinate[];
}) {
  const gems: Shape[] = [];

  const visited: boolean[][] = Array.from({ length: width }, () =>
    Array(height).fill(false)
  );

  const shapes = _find_shapes({
    width,
    height,
    targetTileStyle: TILE_STYLES.GEM_BLUE_ACTIVE,
    board,
    visited,
  });

  for (const shape of shapes) {
    if (isTargetGem(shape, targetGem)) {
      gems.push(shape);
    }
  }

  return {
    gems,
    shapes,
  };
}

export const flattenGamePieceToBoard = ({
  type,
  rotation,
  offset,
  color,
}: GamePiece & {
  color: TileStyle;
}): Board => {
  return SHAPES_DICT[type][rotation].reduce((acc, { x, y }) => {
    const offsetX = x + offset.x;
    const offsetY = y + offset.y;
    const boardKey = createBoardKey({ x: offsetX, y: offsetY });

    acc[boardKey] = {
      type: color,
      coordinate: { x: offsetX, y: offsetY },
    };

    return acc;
  }, {} as Board);
};
