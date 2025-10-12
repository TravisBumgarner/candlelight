import TabWrapper from "@/components/tab-wrapper";
import SelectGameMode from "@/tabs/game/components/select-game-mode";
import { ScrollView } from "react-native";

const Game = () => {
  return (
    <TabWrapper background="homescreen">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SelectGameMode />
      </ScrollView>
    </TabWrapper>
  );
};

export default Game;
