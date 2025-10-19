import {
  Coordinate,
  createBoardKey,
  GamePiece,
  Board as TBoard,
  TILE_STYLES,
} from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import Grid from "./grid";
import { SHAPES_DICT } from "./shapes";

const getInverseStyle = ({
  board,
  coordinate,
}: {
  board: TBoard;
  coordinate: Coordinate;
}) => {
  const tile = board[createBoardKey(coordinate)];

  if (tile.style === TILE_STYLES.EMPTY) {
    return TILE_STYLES.DARK_ACTIVE;
  }

  if (tile.style === TILE_STYLES.DARK_INACTIVE) {
    return TILE_STYLES.LIGHT_ACTIVE;
  }

  if (tile.style === TILE_STYLES.LIGHT_INACTIVE) {
    return TILE_STYLES.DARK_ACTIVE;
  }

  throw new Error("aww heck");
};

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
          style: getInverseStyle({
            board,
            coordinate: { x: offsetX, y: offsetY },
          }),
          coordinate: { x: offsetX, y: offsetY },
        };
        return acc;
      },
      {} as TBoard
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
