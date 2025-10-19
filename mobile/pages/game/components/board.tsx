import {
  BoardKey,
  createBoardKey,
  GamePiece,
  Board as TBoard,
  TILE_STYLES,
  TileStyle,
} from "@/types";
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
  const currentShapeBoard = useMemo(() => {
    return SHAPES_DICT[currentGamePiece.type][currentGamePiece.rotation].reduce(
      (acc, { x, y }) => {
        const offsetX = x + currentGamePiece.offset.x;
        const offsetY = y + currentGamePiece.offset.y;
        const key = createBoardKey({ x: offsetX, y: offsetY });
        acc[key] = {
          type:
            board[key].type === TILE_STYLES.EMPTY
              ? TILE_STYLES.DARK_ACTIVE
              : TILE_STYLES.LIGHT_ACTIVE,
          coordinate: { x: offsetX, y: offsetY },
        };
        return acc;
      },
      {} as Record<
        BoardKey,
        { type: TileStyle; coordinate: { x: number; y: number } }
      >
    );
  }, [currentGamePiece, board]);

  return (
    <View>
      <Grid
        items={{ ...board, ...currentShapeBoard }}
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
      />
    </View>
  );
};

export default Board;
