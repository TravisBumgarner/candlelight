import levelsData from "@/assets/react_native_levels.json";
import {
  default as Button,
  default as PixelMenuButton,
} from "@/components/button";
import Text from "@/components/text";
import {
  Coordinate,
  PieceType,
  PuzzleGameDataSchema,
  Shape,
  TileType,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import Grid from "./grid";
import { SHAPES_DICT } from "./shapes";

const LevelSelect = ({
  setSelectedLevelId,
}: {
  setSelectedLevelId: (id: string) => void;
}) => {
  return (
    <View>
      {levelsData.worlds.map((world) => (
        <View key={world.world_number}>
          <Text variant="header1" textAlign="center">
            World {`${world.world_number}`}: {world.world_name}
          </Text>
          {world.level_numbers.map((levelNum) => (
            <Button
              onPress={() =>
                setSelectedLevelId(`${world.world_number}_${levelNum}`)
              }
              key={levelNum}
              label={`Level ${levelNum}`}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const Target = ({ target }: { target: Shape }) => {
  return (
    <Grid
      width={6}
      height={6}
      items={target.map((coordinate) => ({ coordinate, type: "gem" }))}
    />
  );
};

const Queue = ({ queue }: { queue: Shape[] }) => {
  const flatQueue = useMemo(() => {
    const output: { coordinate: Coordinate; type: TileType }[] = [];

    let yOffset = 0;
    let isFirst = true;
    for (const shape of queue) {
      for (const coordinate of shape) {
        const offsetCoordinate: Coordinate = [
          coordinate[0] + yOffset,
          coordinate[1],
        ];
        output.push({
          coordinate: offsetCoordinate,
          type: isFirst ? "white" : "black",
        });
      }
      yOffset += 4;
      isFirst = false;
    }
    return output;
  }, [queue]);

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Upcoming Pieces
      </Text>
      <Grid items={flatQueue} width={4} height={flatQueue.length} />
    </View>
  );
};

const Board = ({
  history,
  currentPiece,
}: {
  history: Shape[];
  currentPiece: Shape;
}) => {
  const flatHistory = useMemo(() => {
    const allCoordinates: {
      coordinate: Coordinate;
      type: TileType;
    }[] = [];

    history.forEach((shape, index) => {
      const tileType = index % 2 === 0 ? "black" : "white";
      shape.forEach((coordinate) => {
        allCoordinates.push({
          coordinate: coordinate,
          type: tileType,
        });
      });
    });

    return allCoordinates;
  }, [history]);

  console.log("doot", currentPiece[0]);
  const currentPieceTiles = currentPiece.map((coordinate) => ({
    coordinate,
    type: "gem" as const,
  }));

  const allItems = [...flatHistory, ...currentPieceTiles];

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Board History
      </Text>
      <Grid items={allItems} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
    </View>
  );
};

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

  const shapeInBounds = useCallback((shape: Shape) => {
    return shape.every((coordinate) => {
      const [y, x] = coordinate;
      return y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH;
    });
  }, []);

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (currentPieceKey === null) return;

      let movedPiece: Shape = [];

      let offset: Coordinate = [0, 0];
      switch (direction) {
        case "up":
          offset = [-1, 0];
          break;
        case "down":
          offset = [1, 0];
          break;
        case "left":
          offset = [0, -1];
          break;
        case "right":
          offset = [0, 1];
          break;
      }
      movedPiece = SHAPES_DICT[currentPieceKey][currentPieceRotation].map(
        ([y, x]) => [
          currentPieceOffset[0] + y + offset[0],
          currentPieceOffset[1] + x + offset[1],
        ]
      );

      const isOutOfBounds = !shapeInBounds(movedPiece);

      if (isOutOfBounds) {
        alert("bad!");
        return;
      }
      const newCurrentPieceOffset: Coordinate = [
        currentPieceOffset[0] + offset[0],
        currentPieceOffset[1] + offset[1],
      ];
      setCurrentPieceOffset(newCurrentPieceOffset);
    },
    [currentPieceKey, shapeInBounds, currentPieceOffset, currentPieceRotation]
  );

  const rotate = useCallback(() => {
    if (currentPieceKey === null) return;

    // Rotate around the first block in the shape
    const tempRotationIndex = (currentPieceRotation + 1) % 4;
    const shape = SHAPES_DICT[currentPieceKey][tempRotationIndex];
    if (!shape) return;

    // Check if the rotated shape is in bounds
    const offsetShape = shape.map(
      ([y, x]) =>
        [y + currentPieceOffset[0], x + currentPieceOffset[1]] as Coordinate
    );
    if (!shapeInBounds(offsetShape)) {
      alert("Can't rotate out of bounds!");
      return;
    }

    setCurrentPieceRotation(tempRotationIndex);
  }, [
    currentPieceKey,
    currentPieceRotation,
    shapeInBounds,
    currentPieceOffset,
  ]);

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

  const place = useCallback(() => {
    if (currentPieceKey === null) return;

    setHistory((prev) => [
      ...prev,
      SHAPES_DICT[currentPieceKey][currentPieceRotation].map(([y, x]) => [
        y + currentPieceOffset[0],
        x + currentPieceOffset[1],
      ]),
    ]);

    if (queue.length === 0) {
      alert("No more pieces in the queue!");
      return;
    }

    const nextShapeKey = SHAPES_DICT[queue[0]];
    if (!nextShapeKey) {
      alert("Invalid shape key in queue!");
      return;
    }

    setCurrentPieceKey(queue[0]);
    setCurrentPieceRotation(0);
    setQueue((prev) => prev.slice(1));
    setCurrentPieceOffset([
      Math.floor(BOARD_HEIGHT / 2) - 1,
      Math.floor(BOARD_WIDTH / 2) - 1,
    ]);
  }, [currentPieceKey, currentPieceRotation, currentPieceOffset, queue]);

  if (currentPieceKey === null) {
    return <Text variant="body1">Loading...</Text>;
  }

  return (
    <View>
      <Button label="Back to Level Select" onPress={clearLevel} />
      <Text variant="header1" textAlign="center">
        Level {metadata?.level_number} - World {metadata?.world_number}
      </Text>
      <PixelMenuButton label="Up" onPress={() => move("up")} />
      <PixelMenuButton label="Left" onPress={() => move("left")} />
      <PixelMenuButton label="Right" onPress={() => move("right")} />
      <PixelMenuButton label="Down" onPress={() => move("down")} />
      <PixelMenuButton label="Place" onPress={place} />
      <PixelMenuButton label="Rotate" onPress={rotate} />
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
