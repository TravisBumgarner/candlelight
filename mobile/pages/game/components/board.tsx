import Text from "@/components/text";
import { GamePiece, Shape, Board as TBoard } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import Grid from "./grid";
import { SHAPES_DICT } from "./shapes";

const Board = ({
  board,
  currentGamePiece,
}: {
  board: TBoard;
  currentGamePiece: GamePiece;
}) => {
  const currentShape: Shape = useMemo(() => {
    return SHAPES_DICT[currentGamePiece.type][currentGamePiece.rotation].map(
      ({ x, y }) => ({
        x: x + currentGamePiece.offset.x,
        y: y + currentGamePiece.offset.y,
      })
    );
  }, [currentGamePiece]);

  const mergedBoard: TBoard = useMemo(() => {
    return { ...board, currentShape };
  }, [board, currentShape]);

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Board History
      </Text>
      <Grid items={mergedBoard} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
    </View>
  );
};

export default Board;
