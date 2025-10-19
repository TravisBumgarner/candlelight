import { Board, PieceType, TILE_STYLES } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import { flattenGamePieceToBoard } from "../utils";
import Grid from "./grid";

const Queue = ({ queue }: { queue: PieceType[] }) => {
  const flatQueue = useMemo(() => {
    const output: Board = {};

    let yOffset = 1;
    let isFirst = true;
    for (const shapeKey of queue) {
      const board = flattenGamePieceToBoard({
        type: shapeKey,
        offset: { x: 1, y: yOffset },
        rotation: 0,
        style: isFirst ? TILE_STYLES.DARK_ACTIVE : TILE_STYLES.DARK_INACTIVE,
      });
      yOffset += 4;
      isFirst = false;

      Object.assign(output, board);
    }
    return output;
  }, [queue]);

  return (
    <View>
      <Grid items={flatQueue} width={5} height={13} />
    </View>
  );
};

export default Queue;
