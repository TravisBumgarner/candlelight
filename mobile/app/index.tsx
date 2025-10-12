import TabWrapper from "@/components/tab-wrapper";
import Game from "@/pages/game/components/game-root";
import SelectGameMode from "@/pages/game/components/select-game-mode";
import { GameMode } from "@/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";

const GameTab = () => {
  const [selectedGame, setSelectedGame] = useState<GameMode | null>("puzzle");

  useFocusEffect(
    useCallback(() => {
      setSelectedGame("puzzle");
    }, [])
  );

  return (
    <TabWrapper background={selectedGame ? "game" : "home"}>
      {!selectedGame && (
        <SelectGameMode handleModeSelectCallback={setSelectedGame} />
      )}
      {selectedGame && <Game selectedGame={selectedGame} />}
    </TabWrapper>
  );
};

export default GameTab;
