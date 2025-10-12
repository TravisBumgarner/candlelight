import TabWrapper from "@/components/tab-wrapper";
import Game from "@/tabs/game/components/game-root";
import SelectGameMode from "@/tabs/game/components/select-game-mode";
import { GameMode } from "@/types";
import { useState } from "react";
import { ScrollView } from "react-native";

const GameTab = () => {
  const [selectedGame, setSelectedGame] = useState<GameMode | null>(null);

  return (
    <TabWrapper background={selectedGame ? "game" : "home"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {!selectedGame && (
          <SelectGameMode handleModeSelectCallback={setSelectedGame} />
        )}
        {selectedGame && <Game selectedGame={selectedGame} />}
      </ScrollView>
    </TabWrapper>
  );
};

export default GameTab;
