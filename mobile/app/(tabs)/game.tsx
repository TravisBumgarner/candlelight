import { useState, useCallback } from "react";
import TabWrapper from "@/components/tab-wrapper";
import SelectGameMode from "@/tabs/game/components/select-game-mode";
import { TutorialScreen, FreePlayScreen, FreePlayMenu, DailyScreen } from "@/game/components";
import { ScrollView, View, StyleSheet } from "react-native";
import type { FreePlaySlot } from "@/game/modes/free-play";

type GameMode = "puzzles" | "freeplay" | "daily" | "tutorial";
type Screen = "menu" | "tutorial" | "freeplay-menu" | "freeplay-game" | "daily" | "puzzle";

const Game = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");
  const [freePlaySlot, setFreePlaySlot] = useState<FreePlaySlot | null>(null);

  const handleSelectMode = useCallback((mode: GameMode) => {
    switch (mode) {
      case "tutorial":
        setCurrentScreen("tutorial");
        break;
      case "freeplay":
        setCurrentScreen("freeplay-menu");
        break;
      case "daily":
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
    setFreePlaySlot(null);
  }, []);

  const handleFreePlaySlotSelect = useCallback((slot: FreePlaySlot, _isNewGame: boolean) => {
    setFreePlaySlot(slot);
    setCurrentScreen("freeplay-game");
  }, []);

  const handleFreePlayExit = useCallback(() => {
    setCurrentScreen("freeplay-menu");
    setFreePlaySlot(null);
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

  if (currentScreen === "freeplay-menu") {
    return (
      <View style={styles.fullScreen}>
        <FreePlayMenu
          onSelectSlot={handleFreePlaySlotSelect}
          onBack={handleReturnToMenu}
        />
      </View>
    );
  }

  if (currentScreen === "freeplay-game" && freePlaySlot) {
    return (
      <View style={styles.fullScreen}>
        <FreePlayScreen
          slot={freePlaySlot}
          onExit={handleFreePlayExit}
        />
      </View>
    );
  }

  if (currentScreen === "daily") {
    return (
      <View style={styles.fullScreen}>
        <DailyScreen onExit={handleReturnToMenu} />
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
