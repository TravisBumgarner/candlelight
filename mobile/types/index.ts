import { z } from "zod";

export type GameMode = "puzzle" | "free-play" | "daily" | "tutorial";

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
  target_gem: z.array(z.tuple([z.number(), z.number()])),
  difficulty: z.number(),
  comments: z.string().nullable(),
});

export type PuzzleLevel = z.infer<typeof PuzzleLevelSchema>;

export const PuzzleGameDataSchema = z.object({
  worlds: z.array(PuzzleWorldSchema),
  levels: z.record(z.string(), PuzzleLevelSchema),
});

export type PuzzleGameData = z.infer<typeof PuzzleGameDataSchema>;
