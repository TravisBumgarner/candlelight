import Button from "@/components/button";
import { SPACING } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type GAME_MODE = "puzzles" | "freeplay" | "daily" | "tutorial";

const gameModeDetailsLookup: Record<
  GAME_MODE,
  { title: string; description: string }
> = {
  puzzles: {
    title: "Puzzles",
    description: "Solve puzzles using limited shapes.",
  },
  freeplay: {
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

const SelectGameMode = () => {
  const [pendingGame, setPendingGame] = useState<GAME_MODE | null>(null);

  return (
    <View style={styles.container}>
      <Button
        fullWidth
        label="Puzzles"
        onPress={() => setPendingGame("puzzles")}
      />
      <Button
        fullWidth
        label="Free Play"
        onPress={() => setPendingGame("freeplay")}
      />
      <Button fullWidth label="Daily" onPress={() => setPendingGame("daily")} />
      <Button
        fullWidth
        label="Tutorial"
        onPress={() => setPendingGame("tutorial")}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {pendingGame
            ? `${gameModeDetailsLookup[pendingGame].description}`
            : "Select a game mode to see details."}
        </Text>
        <Button fullWidth onPress={() => alert("playing")} label="Play" />
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
