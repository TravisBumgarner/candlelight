import levelsData from "@/assets/react_native_levels.json";
import { default as Button } from "@/components/button";
import Text from "@/components/text";
import {
  createBoardKey,
  GamePiece,
  PieceType,
  PuzzleGameDataSchema,
  Shape,
  Board as TBoard,
  Tile,
  TILE_STYLES,
} from "@/types";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import Board from "./components/board";
import Controls from "./components/controls";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./components/game.consts";
import LevelSelect from "./components/level-select";
import Queue from "./components/queue";
import Target from "./components/target";
import { findGemsAndShapes } from "./utils";

const makeBoard = () => {
  const board: Record<string, Tile> = {};

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const key = createBoardKey({ x, y });
      board[key] = { type: TILE_STYLES.EMPTY, coordinate: { y, x } };
    }
  }

  return board;
};

const Level = ({
  levelId,
  clearLevel,
}: {
  levelId: string;
  clearLevel: () => void;
}) => {
  const [history, setHistory] = useState<Shape[]>([]);
  const [currentGamePiece, setGamePiece] = useState<GamePiece | null>(null);
  const [queue, setQueue] = useState<PieceType[]>([]);
  const [targetGem, setTarget] = useState<Shape>([]);
  const [metadata, setMetadata] = useState<{
    world_number: number;
    level_number: number;
    world_name: string;
  } | null>(null);
  const [board, setBoard] = useState<TBoard>(makeBoard());

  const updateGamePiece = useCallback((newPiece: GamePiece) => {
    setGamePiece(newPiece);
  }, []);

  const handlePlaceCallback = useCallback(
    ({ nextGamePiece }: { nextGamePiece: GamePiece }) => {
      findGemsAndShapes({
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        board: board,
        targetGem,
      });
    },
    [targetGem, board]
  );

  useEffect(() => {
    const validatedData = PuzzleGameDataSchema.parse(levelsData);

    const level = validatedData.levels[levelId];
    setHistory([]);
    setGamePiece({
      type: level.queue[0],
      rotation: 0,
      offset: {
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: Math.floor(BOARD_HEIGHT / 2) - 1,
      },
    });
    setQueue(level.queue.slice(1));
    setTarget(level.target_gem);
    setMetadata({
      world_number: level.world_number,
      level_number: level.level_number,
      world_name:
        validatedData.worlds.find((w) => w.world_number === level.world_number)
          ?.world_name || "",
    });
  }, [levelId]);

  if (currentGamePiece === null) {
    return <Text variant="body1">Loading...</Text>;
  }

  return (
    <View>
      <Button label="Back to Level Select" onPress={clearLevel} />
      <Text variant="header1" textAlign="center">
        Level {metadata?.level_number} - World {metadata?.world_number}
      </Text>
      <Controls
        handlePlaceCallback={handlePlaceCallback}
        queue={queue}
        setQueue={setQueue}
        updateGamePiece={updateGamePiece}
        currentGamePiece={currentGamePiece}
        setHistory={setHistory}
      />
      <Board currentGamePiece={currentGamePiece} board={board} />
      <Target target={targetGem} />
      <Queue queue={queue} />
    </View>
  );
};

const GamePuzzle = () => {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>("5_2");

  return (
    <View>
      {!selectedLevelId && (
        <LevelSelect setSelectedLevelId={setSelectedLevelId} />
      )}
      {selectedLevelId && (
        <Level
          levelId={selectedLevelId}
          clearLevel={() => setSelectedLevelId(null)}
        />
      )}
    </View>
  );
};

export default GamePuzzle;
