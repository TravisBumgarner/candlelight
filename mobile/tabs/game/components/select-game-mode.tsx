import { GAME_COLORS, FONT_SIZES, SPACING } from "@/constants/theme";
import { StyleSheet, Text, View, Pressable } from "react-native";

type MenuAction = "puzzles" | "freeplay" | "daily" | "tutorial" | "settings" | "credits";

interface GameModeButtonProps {
  title: string;
  description: string;
  onPress: () => void;
}

const GameModeButton = ({ title, description, onPress }: GameModeButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonTitle}>{title}</Text>
      <Text style={styles.buttonDescription}>{description}</Text>
    </Pressable>
  );
};

interface SmallButtonProps {
  title: string;
  onPress: () => void;
}

const SmallButton = ({ title, onPress }: SmallButtonProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.smallButton,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.smallButtonTitle}>{title}</Text>
    </Pressable>
  );
};

interface SelectGameModeProps {
  onSelectMode: (action: MenuAction) => void;
}

const SelectGameMode = ({ onSelectMode }: SelectGameModeProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Game modes - 2x2 */}
        <View style={styles.row}>
          <GameModeButton
            title="Puzzles"
            description="Solve puzzles using limited shapes"
            onPress={() => onSelectMode("puzzles")}
          />
          <GameModeButton
            title="Free Play"
            description="Unwind and play at your own pace"
            onPress={() => onSelectMode("freeplay")}
          />
        </View>
        <View style={styles.row}>
          <GameModeButton
            title="Daily"
            description="Daily challenge with fewest moves"
            onPress={() => onSelectMode("daily")}
          />
          <GameModeButton
            title="Tutorial"
            description="Master the game's basics"
            onPress={() => onSelectMode("tutorial")}
          />
        </View>

        {/* Settings and Credits - smaller buttons */}
        <View style={styles.row}>
          <SmallButton
            title="Settings"
            onPress={() => onSelectMode("settings")}
          />
          <SmallButton
            title="Credits"
            onPress={() => onSelectMode("credits")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.SMALL.INT,
  },
  grid: {
    gap: SPACING.SMALL.INT,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.SMALL.INT,
  },
  button: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    borderRadius: 8,
    padding: SPACING.MEDIUM.INT,
    width: 150,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderColor: GAME_COLORS.BUTTON_HIGHLIGHT,
  },
  buttonTitle: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.SMALL.INT,
  },
  buttonDescription: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
  smallButton: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    borderRadius: 8,
    padding: SPACING.SMALL.INT,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButtonTitle: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});

export default SelectGameMode;
