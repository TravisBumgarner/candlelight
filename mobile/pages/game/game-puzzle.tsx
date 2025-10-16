import levelsData from "@/assets/react_native_levels.json";
import { default as Button } from "@/components/button";
import Text from "@/components/text";
import { Coordinate, PieceType, PuzzleGameDataSchema, Shape } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import Board from "./components/board";
import Controls from "./components/controls";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./components/game.consts";
import LevelSelect from "./components/level-select";
import Queue from "./components/queue";
import { SHAPES_DICT } from "./components/shapes";
import Target from "./components/target";

const Level = ({
  levelId,
  clearLevel,
}: {
  levelId: string;
  clearLevel: () => void;
}) => {
  const [history, setHistory] = useState<Shape[]>([]);
  const [currentPieceKey, setCurrentPieceKey] = useState<PieceType | null>(
    null
  );
  const [currentPieceRotation, setCurrentPieceRotation] = useState(0);
  const [currentPieceOffset, setCurrentPieceOffset] = useState<Coordinate>([
    Math.floor(BOARD_HEIGHT / 2) - 1,
    Math.floor(BOARD_WIDTH / 2) - 1,
  ]);

  const [queue, setQueue] = useState<PieceType[]>([]);
  const [target, setTarget] = useState<Shape>([]);
  const [metadata, setMetadata] = useState<{
    world_number: number;
    level_number: number;
    world_name: string;
  } | null>(null);

  useEffect(() => {
    const validatedData = PuzzleGameDataSchema.parse(levelsData);
    const level = validatedData.levels[levelId];

    setHistory([]);
    setCurrentPieceKey(level.queue[0]);
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

  const shapeKeyToVector = useCallback(
    (key: PieceType, rotationIndex: number) => {
      return SHAPES_DICT[key][rotationIndex];
    },
    []
  );

  const currentPiece: Shape = useMemo(() => {
    if (currentPieceKey === null) return [];
    return SHAPES_DICT[currentPieceKey][currentPieceRotation].map(([y, x]) => [
      y + currentPieceOffset[0],
      x + currentPieceOffset[1],
    ]);
  }, [currentPieceKey, currentPieceOffset, currentPieceRotation]);

  if (currentPieceKey === null) {
    return <Text variant="body1">Loading...</Text>;
  }

  return (
    <View>
      <Button label="Back to Level Select" onPress={clearLevel} />
      <Text variant="header1" textAlign="center">
        Level {metadata?.level_number} - World {metadata?.world_number}
      </Text>
      <Controls
        queue={queue}
        setQueue={setQueue}
        setCurrentPieceKey={setCurrentPieceKey}
        currentPieceKey={currentPieceKey}
        currentPieceRotation={currentPieceRotation}
        setCurrentPieceRotation={setCurrentPieceRotation}
        currentPieceOffset={currentPieceOffset}
        setCurrentPieceOffset={setCurrentPieceOffset}
        setHistory={setHistory}
      />
      <Board history={history} currentPiece={currentPiece} />
      <Target target={target} />
      <Queue queue={queue.map((key) => shapeKeyToVector(key, 0))} />
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
