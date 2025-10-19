import { z } from "zod";

export type GameMode = "puzzle" | "free-play" | "daily" | "tutorial";

export const TILE_STYLES = {
  EMPTY: "EMPTY",
  DARK_INACTIVE: "DARK_INACTIVE",
  LIGHT_INACTIVE: "LIGHT_INACTIVE",
  DARK_ACTIVE: "DARK_ACTIVE",
  LIGHT_ACTIVE: "LIGHT_ACTIVE",
  MID_BORDER: "MID_BORDER",
  GEM_BLUE_INACTIVE: "GEM_BLUE_INACTIVE",
  GEM_BLUE_ACTIVE: "GEM_BLUE_ACTIVE",
} as const;

export type TileStyle = keyof typeof TILE_STYLES;

export const PieceTypeSchema = z.enum([
  "upper_l",
  "lower_z",
  "square",
  "u",
  "upper_z",
  "t",
  "w",
]);

export type PieceType = z.infer<typeof PieceTypeSchema>;

export const PuzzleWorldSchema = z.object({
  world_number: z.number(),
  world_name: z.string(),
  level_numbers: z.array(z.number()),
});

export type PuzzleWorld = z.infer<typeof PuzzleWorldSchema>;

export const PuzzleLevelSchema = z.object({
  world_number: z.number(),
  level_number: z.number(),
  queue: z.array(PieceTypeSchema),
  target_gem: z.array(z.object({ x: z.number(), y: z.number() })),
  difficulty: z.number(),
  comments: z.string().nullable(),
});

export type PuzzleLevel = z.infer<typeof PuzzleLevelSchema>;

export const PuzzleGameDataSchema = z.object({
  worlds: z.array(PuzzleWorldSchema),
  levels: z.record(z.string(), PuzzleLevelSchema),
});

export type PuzzleGameData = z.infer<typeof PuzzleGameDataSchema>;

export type Coordinate = { x: number; y: number };

export type Tile = {
  coordinate: Coordinate;
  type: TileStyle;
};

export type Shape = Coordinate[];

export type GamePiece = {
  type: PieceType;
  rotation: number;
  offset: Coordinate;
};

export type BoardKey = `${number}_${number}`;

export type Board = Record<BoardKey, Tile>;

export const createBoardKey = ({ x, y }: Coordinate) => `${y}_${x}` as BoardKey;
