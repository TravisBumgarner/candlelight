import levelsData from "@/assets/react_native_levels.json";
import Text from "@/components/text";
import {
  Coordinate,
  createBoardKey,
  GamePiece,
  PieceType,
  PuzzleGameDataSchema,
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
import { findGemsAndShapes, flattenGamePieceToBoard } from "./utils";

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
  const [history, setHistory] = useState<GamePiece[]>([]);
  const [currentGamePiece, setGamePiece] = useState<GamePiece | null>(null);
  const [queue, setQueue] = useState<PieceType[]>([]);
  const [targetGem, setTarget] = useState<Coordinate[]>([]);
  const [metadata, setMetadata] = useState<{
    world_number: number;
    level_number: number;
    world_name: string;
  } | null>(null);
  const [board, setBoard] = useState<TBoard>(makeBoard());

  const updateGamePiece = useCallback((newPiece: GamePiece) => {
    console.log("updateGamePiece called in parent with:", newPiece);
    setGamePiece(newPiece);
    console.log("setGamePiece called");
  }, []);

  useEffect(() => {
    console.log("currentGamePiece state changed to:", currentGamePiece?.offset);
  }, [currentGamePiece]);

  const handlePlaceCallback = useCallback(
    ({ nextGamePiece }: { nextGamePiece: GamePiece }) => {
      if (!targetGem) {
        alert("no target gem");
        return;
      }

      findGemsAndShapes({
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        board: board,
        targetGem,
      });

      if (!currentGamePiece) {
        alert("No current game piece!");
        return;
      }

      const flattenedShape = flattenGamePieceToBoard({
        type: currentGamePiece.type,
        offset: currentGamePiece.offset,
        rotation: currentGamePiece.rotation,
        color: TILE_STYLES.DARK_INACTIVE,
      });

      const newBoard: TBoard = {
        ...board,
        ...flattenedShape,
      };
      // console.log("New Board after placement:", newBoard);
      setBoard(newBoard);
      setGamePiece(nextGamePiece);
      setQueue((prev) => prev.slice(1));
    },
    [targetGem, board, currentGamePiece]
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
      <Text variant="header1" textAlign="center">
        Level {metadata?.level_number} - World {metadata?.world_number}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <View>
          <Target target={targetGem} />
          <Queue queue={queue} />
        </View>
        <View>
          <Controls
            handlePlaceCallback={handlePlaceCallback}
            queue={queue}
            setQueue={setQueue}
            updateGamePiece={updateGamePiece}
            currentGamePiece={currentGamePiece}
            setHistory={setHistory}
            history={history}
          >
            <Board currentGamePiece={currentGamePiece} board={board} />
          </Controls>
        </View>
      </View>
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
