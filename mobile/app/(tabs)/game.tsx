import { useState, useCallback } from "react";
import TabWrapper from "@/components/tab-wrapper";
import SelectGameMode from "@/tabs/game/components/select-game-mode";
import { TutorialScreen } from "@/game/components";
import { ScrollView, View, StyleSheet } from "react-native";

type GameMode = "puzzles" | "freeplay" | "daily" | "tutorial";
type Screen = "menu" | "tutorial" | "freeplay" | "daily" | "puzzle";

const Game = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");

  const handleSelectMode = useCallback((mode: GameMode) => {
    switch (mode) {
      case "tutorial":
        setCurrentScreen("tutorial");
        break;
      case "freeplay":
        // TODO: Implement in milestone 5
        setCurrentScreen("freeplay");
        break;
      case "daily":
        // TODO: Implement in milestone 6
        setCurrentScreen("daily");
        break;
      case "puzzles":
        // TODO: Implement in milestone 7
        setCurrentScreen("puzzle");
        break;
    }
  }, []);

  const handleReturnToMenu = useCallback(() => {
    setCurrentScreen("menu");
  }, []);

  // Render based on current screen
  if (currentScreen === "tutorial") {
    return (
      <View style={styles.fullScreen}>
        <TutorialScreen
          onComplete={handleReturnToMenu}
          onExit={handleReturnToMenu}
        />
      </View>
    );
  }

  // Default: show menu
  return (
    <TabWrapper background="homescreen">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SelectGameMode onSelectMode={handleSelectMode} />
      </ScrollView>
    </TabWrapper>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#0a1015",
  },
});

export default Game;
