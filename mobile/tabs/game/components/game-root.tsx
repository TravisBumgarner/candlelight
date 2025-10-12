import { GameMode } from "@/types";
import { Button, View } from "react-native";
import GameDaily from "./game-daily";
import GameFreePlay from "./game-free-play";
import GamePuzzle from "./game-puzzle";
import GameTutorial from "./game-tutorial";

const GamePicker = ({ selectedGame }: { selectedGame: GameMode }) => {
  switch (selectedGame) {
    case "daily":
      return <GameDaily />;
    case "free-play":
      return <GameFreePlay />;
    case "puzzle":
      return <GamePuzzle />;
    case "tutorial":
      return <GameTutorial />;

    default: {
      const _exhaustiveCheck: never = selectedGame;
      throw new Error(`Unhandled game mode: ${_exhaustiveCheck}`);
    }
  }
};

const Game = ({ selectedGame }: { selectedGame: GameMode }) => {
  return (
    <View>
      <Button
        title="Main Menu"
        onPress={() => {
          /* Navigate to main menu */
        }}
      />
      <GamePicker selectedGame={selectedGame} />
    </View>
  );
};

export default Game;
