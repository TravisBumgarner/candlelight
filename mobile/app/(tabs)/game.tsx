import { useState, useCallback } from "react";
import TabWrapper from "@/components/tab-wrapper";
import SelectGameMode from "@/tabs/game/components/select-game-mode";
import SettingsScreen from "@/components/settings-screen";
import CreditsScreen from "@/components/credits-screen";
import {
  TutorialScreen,
  FreePlayScreen,
  FreePlayMenu,
  DailyScreen,
  PuzzleWorldSelect,
  PuzzleLevelSelect,
  PuzzleScreen,
} from "@/game/components";
import { ScrollView, View, StyleSheet } from "react-native";
import type { FreePlaySlot } from "@/game/modes/free-play";

type MenuAction = "puzzles" | "freeplay" | "daily" | "tutorial" | "settings" | "credits";
type Screen =
  | "menu"
  | "tutorial"
  | "freeplay-menu"
  | "freeplay-game"
  | "daily"
  | "puzzle-world-select"
  | "puzzle-level-select"
  | "puzzle-game"
  | "settings"
  | "credits";

const Game = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");
  const [freePlaySlot, setFreePlaySlot] = useState<FreePlaySlot | null>(null);
  const [puzzleWorld, setPuzzleWorld] = useState<number | null>(null);
  const [puzzleLevel, setPuzzleLevel] = useState<number | null>(null);

  const handleSelectMode = useCallback((action: MenuAction) => {
    switch (action) {
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
        setCurrentScreen("puzzle-world-select");
        break;
      case "settings":
        setCurrentScreen("settings");
        break;
      case "credits":
        setCurrentScreen("credits");
        break;
    }
  }, []);

  const handleReturnToMenu = useCallback(() => {
    setCurrentScreen("menu");
    setFreePlaySlot(null);
    setPuzzleWorld(null);
    setPuzzleLevel(null);
  }, []);

  const handleFreePlaySlotSelect = useCallback((slot: FreePlaySlot, _isNewGame: boolean) => {
    setFreePlaySlot(slot);
    setCurrentScreen("freeplay-game");
  }, []);

  const handleFreePlayExit = useCallback(() => {
    setCurrentScreen("freeplay-menu");
    setFreePlaySlot(null);
  }, []);

  // Puzzle mode handlers
  const handlePuzzleWorldSelect = useCallback((worldNumber: number) => {
    setPuzzleWorld(worldNumber);
    setCurrentScreen("puzzle-level-select");
  }, []);

  const handlePuzzleLevelSelect = useCallback((levelNumber: number) => {
    setPuzzleLevel(levelNumber);
    setCurrentScreen("puzzle-game");
  }, []);

  const handlePuzzleBackToWorlds = useCallback(() => {
    setPuzzleWorld(null);
    setCurrentScreen("puzzle-world-select");
  }, []);

  const handlePuzzleBackToLevels = useCallback(() => {
    setPuzzleLevel(null);
    setCurrentScreen("puzzle-level-select");
  }, []);

  const handlePuzzleNextLevel = useCallback((worldNumber: number, levelNumber: number) => {
    setPuzzleWorld(worldNumber);
    setPuzzleLevel(levelNumber);
    // Screen stays on puzzle-game, but the level changes
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

  if (currentScreen === "puzzle-world-select") {
    return (
      <View style={styles.fullScreen}>
        <PuzzleWorldSelect
          onSelectWorld={handlePuzzleWorldSelect}
          onBack={handleReturnToMenu}
        />
      </View>
    );
  }

  if (currentScreen === "puzzle-level-select" && puzzleWorld !== null) {
    return (
      <View style={styles.fullScreen}>
        <PuzzleLevelSelect
          worldNumber={puzzleWorld}
          onSelectLevel={handlePuzzleLevelSelect}
          onBack={handlePuzzleBackToWorlds}
        />
      </View>
    );
  }

  if (currentScreen === "puzzle-game" && puzzleWorld !== null && puzzleLevel !== null) {
    return (
      <View style={styles.fullScreen}>
        <PuzzleScreen
          key={`${puzzleWorld}_${puzzleLevel}`}
          worldNumber={puzzleWorld}
          levelNumber={puzzleLevel}
          onNextLevel={handlePuzzleNextLevel}
          onExit={handlePuzzleBackToLevels}
        />
      </View>
    );
  }

  if (currentScreen === "settings") {
    return (
      <View style={styles.fullScreen}>
        <SettingsScreen onBack={handleReturnToMenu} />
      </View>
    );
  }

  if (currentScreen === "credits") {
    return (
      <View style={styles.fullScreen}>
        <CreditsScreen onBack={handleReturnToMenu} />
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
