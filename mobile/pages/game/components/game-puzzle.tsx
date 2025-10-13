import levelsData from "@/assets/react_native_levels.json";
import {
  default as Button,
  default as PixelMenuButton,
} from "@/components/button";
import Text from "@/components/text";
import { Coordinate, PuzzleGameDataSchema, Shape, TileType } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
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
      <Grid items={allItems} width={10} height={10} />
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
  const [currentPiece, setCurrentPiece] = useState<Shape>([]);
  const [queue, setQueue] = useState<Shape[]>([]);
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
    setCurrentPiece(SHAPES_DICT[level.queue[0]][0]);
    setQueue(level.queue.slice(1).map((key) => SHAPES_DICT[key][0]));
    setTarget(level.target_gem);
    setMetadata({
      world_number: level.world_number,
      level_number: level.level_number,
      world_name:
        validatedData.worlds.find((w) => w.world_number === level.world_number)
          ?.world_name || "",
    });
  }, [levelId]);

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      let movedPiece: Shape = [];
      switch (direction) {
        case "up":
          movedPiece = currentPiece.map(([y, x]) => [y - 1, x]);
          break;
        case "down":
          movedPiece = currentPiece.map(([y, x]) => [y + 1, x]);
          break;
        case "left":
          movedPiece = currentPiece.map(([y, x]) => [y, x - 1]);
          break;
        case "right":
          movedPiece = currentPiece.map(([y, x]) => [y, x + 1]);
          break;
      }

      const isOutOfBounds = movedPiece.some(
        ([y, x]) => y < 0 || y >= 10 || x < 0 || x >= 10
      );

      const overlapsHistory = movedPiece.some((coord) =>
        history.some((histPiece) =>
          histPiece.some(
            (histCoord) =>
              histCoord[0] === coord[0] && histCoord[1] === coord[1]
          )
        )
      );

      if (isOutOfBounds || overlapsHistory) {
        alert("bad!");
        return;
      }

      setCurrentPiece(movedPiece);
    },
    [currentPiece, history]
  );

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
      <Board history={history} currentPiece={currentPiece} />
      <Target target={target} />
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
