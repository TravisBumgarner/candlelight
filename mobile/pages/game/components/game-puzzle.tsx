import levelsData from "@/assets/react_native_levels.json";
import Button from "@/components/button";
import Text from "@/components/text";
import { PuzzleGameDataSchema, PuzzleLevel } from "@/types";
import { useState } from "react";
import { View } from "react-native";
import Board from "./board";

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

const Level = ({
  levelId,
  clearLevel,
}: {
  levelId: string;
  clearLevel: () => void;
}) => {
  try {
    // Validate the entire levels data structure
    const validatedData = PuzzleGameDataSchema.parse(levelsData);

    // Get the specific level
    const rawLevel = validatedData.levels[levelId];

    if (!rawLevel) {
      return (
        <View>
          <Text variant="header1" textAlign="center">
            Level not found: {levelId}
          </Text>
        </View>
      );
    }

    // rawLevel is now fully type-safe and validated
    const level: PuzzleLevel = rawLevel;

    return (
      <View>
        <Button label="Back to Level Select" onPress={clearLevel} />
        <Text variant="header1" textAlign="center">
          Level {level.level_number} - World {level.world_number}
        </Text>
        <Text variant="body1">Difficulty: {level.difficulty}</Text>
        <Text variant="body1">Comments: {level.comments || "No comments"}</Text>
        <Text variant="body1">Queue Length: {level.queue.length}</Text>
        <Text variant="body1">Target Gems: {level.target_gem.length}</Text>
        <Board />
      </View>
    );
  } catch (error) {
    return (
      <View>
        <Text variant="header1" textAlign="center">
          Invalid level data: {levelId}
        </Text>
        <Text variant="body1">
          Error: {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </View>
    );
  }
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
