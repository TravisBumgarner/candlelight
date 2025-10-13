import levelsData from "@/assets/react_native_levels.json";
import Button from "@/components/button";
import Text from "@/components/text";
import { Coordinate, PuzzleGameDataSchema, Shape } from "@/types";
import { useEffect, useMemo, useState } from "react";
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
    let output: Coordinate[] = [];
    let yOffset = 0;
    for (const shape of queue) {
      for (const coordinate of shape) {
        output.push([coordinate[0] + yOffset, coordinate[1]]);
      }
      yOffset += 4;
    }
    return output;
  }, [queue]);

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Upcoming Pieces
      </Text>
      <Grid
        items={flatQueue.map((coordinate, index) => ({
          coordinate,
          type: "white",
        }))}
        width={4}
        height={flatQueue.length}
      />
    </View>
  );
};

const Board = ({ history }: { history: Shape[] }) => {
  const flatHistory = useMemo(() => {
    const allCoordinates: {
      coordinate: [number, number];
      type: "black" | "white";
    }[] = [];

    history.forEach((shape, index) => {
      const tileType = index % 2 === 0 ? "black" : "white";
      shape.forEach((coordinate) => {
        allCoordinates.push({ coordinate, type: tileType });
      });
    });

    return allCoordinates;
  }, [history]);

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Board History
      </Text>
      <Grid items={flatHistory} width={10} height={10} />
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
  const [queue, setQueue] = useState<Shape[]>([]);
  const [target, setTarget] = useState<Shape>([]);
  const [metadata, setMetdata] = useState<{
    world_number: number;
    level_number: number;
    world_name: string;
  } | null>(null);

  useEffect(() => {
    const validatedData = PuzzleGameDataSchema.parse(levelsData);
    const level = validatedData.levels[levelId];

    setHistory([]);
    setQueue(level.queue.map((key) => SHAPES_DICT[key][0]));
    setTarget(level.target_gem);
    setMetdata({
      world_number: level.world_number,
      level_number: level.level_number,
      world_name:
        validatedData.worlds.find((w) => w.world_number === level.world_number)
          ?.world_name || "",
    });
  }, [levelId]);

  return (
    <View>
      <Button label="Back to Level Select" onPress={clearLevel} />
      <Text variant="header1" textAlign="center">
        Level {metadata?.level_number} - World {metadata?.world_number}
      </Text>
      <Board history={history} />
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
