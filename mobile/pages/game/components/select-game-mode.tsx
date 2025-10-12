import Button from "@/components/button";
import { SPACING } from "@/constants/theme";
import { GameMode } from "@/types";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const gameModeDetailsLookup: Record<
  GameMode,
  { title: string; description: string }
> = {
  puzzle: {
    title: "Puzzle",
    description: "Solve puzzles using limited shapes.",
  },
  "free-play": {
    title: "Free Play",
    description: "Unwind and play at your own pace",
  },
  daily: {
    title: "Daily",
    description: "Solve the daily challenge with the fewest moves.",
  },
  tutorial: {
    title: "Tutorial",
    description: "Master the game's basics.",
  },
};

const SelectGameMode = ({
  handleModeSelectCallback,
}: {
  handleModeSelectCallback: (mode: GameMode) => void;
}) => {
  const [pendingGame, setPendingGame] = useState<GameMode | null>(null);

  const handleModeSelect = useCallback(() => {
    if (!pendingGame) return;

    handleModeSelectCallback(pendingGame);
  }, [pendingGame, handleModeSelectCallback]);

  return (
    <View style={styles.container}>
      {(Object.keys(gameModeDetailsLookup) as GameMode[]).map((mode) => (
        <Button
          key={mode}
          fullWidth
          label={gameModeDetailsLookup[mode].title}
          onPress={() => setPendingGame(mode)}
        />
      ))}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {pendingGame
            ? `${gameModeDetailsLookup[pendingGame].description}`
            : "Select a game mode to see details."}
        </Text>
        <Button
          disabled={!pendingGame}
          fullWidth
          onPress={handleModeSelect}
          label="Play"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.TINY.INT,
    margin: SPACING.LARGE.INT,
  },
  textContainer: {
    height: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  text: {
    fontFamily: "DepartureMonoRegular",
    color: "#FFFFFF",
    fontSize: SPACING.MEDIUM.INT,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
});

export default SelectGameMode;
