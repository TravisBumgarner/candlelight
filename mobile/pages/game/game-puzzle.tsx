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
import { SHAPES_DICT } from "./components/shapes";
import Target from "./components/target";
import { findGemsAndShapes, flattenGamePieceToBoard } from "./utils";

const getPlacementTileStyle = ({
  board,
  coordinate,
}: {
  board: TBoard;
  coordinate: Coordinate;
}) => {
  const tile = board[createBoardKey(coordinate)];

  if (tile.style === TILE_STYLES.EMPTY) {
    return TILE_STYLES.DARK_INACTIVE;
  }

  if (tile.style === TILE_STYLES.DARK_INACTIVE) {
    return TILE_STYLES.LIGHT_INACTIVE;
  }

  if (tile.style === TILE_STYLES.LIGHT_INACTIVE) {
    return TILE_STYLES.DARK_INACTIVE;
  }

  throw new Error("aww heck");
};

const makeBoard = () => {
  const board: Record<string, Tile> = {};

  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      const key = createBoardKey({ x, y });
      board[key] = { style: TILE_STYLES.EMPTY, coordinate: { y, x } };
    }
  }

  return board;
};

// TODO - might be worth separating level out such that we know various bits exist like queue.
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
    setGamePiece(newPiece);
  }, []);

  const handlePlaceCallback = useCallback(() => {
    if (!targetGem || !currentGamePiece) {
      alert("no target gem");
      return;
    }

    setHistory([...history, currentGamePiece]);

    // This could probably be done in one pass to get the actual tile color.
    // But for now, flatten first, then assign color.
    const rawBoard = flattenGamePieceToBoard({
      type: currentGamePiece.type,
      offset: currentGamePiece.offset,
      rotation: currentGamePiece.rotation,
      style: TILE_STYLES.DARK_INACTIVE,
    });

    const flattenedShape = Object.keys(rawBoard).reduce((acc, key) => {
      const tile = rawBoard[key as keyof typeof rawBoard];
      (acc as any)[key] = {
        ...tile,
        style: getPlacementTileStyle({
          board,
          coordinate: tile.coordinate,
        }),
      };
      return acc;
    }, {} as TBoard);

    const newBoard: TBoard = {
      ...board,
      ...flattenedShape,
    };

    const result = findGemsAndShapes({
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      board: newBoard,
      targetGem,
    });

    if (result.gems.length > 0) {
      alert(`level complete! gems found: ${result.gems.length}`);
      // todo track best score
      // todo next level.
      return;
    }

    if (queue.length === 0) {
      alert("No more pieces in the queue!");
      return;
    }

    const nextShapeKey = SHAPES_DICT[queue[0]];
    if (!nextShapeKey) {
      alert("Invalid shape key in queue!");
      return;
    }

    if (!currentGamePiece) {
      alert("No current game piece!");
      return;
    }

    const nextGamePiece = {
      type: queue[0],
      rotation: 0,
      offset: {
        y: Math.floor(BOARD_HEIGHT / 2) - 1,
        x: Math.floor(BOARD_WIDTH / 2) - 1,
      },
    } as GamePiece;

    setBoard(newBoard);
    setQueue((prev) => prev.slice(1));
    setGamePiece(nextGamePiece);
  }, [targetGem, board, currentGamePiece, queue, history]);

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
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>("1_1");

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
