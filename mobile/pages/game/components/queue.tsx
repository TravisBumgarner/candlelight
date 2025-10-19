import Text from "@/components/text";
import { Board, PieceType, TILE_STYLES } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import { flattenShapeToBoard } from "../utils";
import Grid from "./grid";

const Queue = ({ queue }: { queue: PieceType[] }) => {
  const flatQueue = useMemo(() => {
    const output: Board = {};

    let yOffset = 0;
    let isFirst = true;
    for (const shapeKey of queue) {
      const board = flattenShapeToBoard({
        key: shapeKey,
        offset: { x: 0, y: yOffset },
        rotationIndex: 0,
        color: isFirst ? TILE_STYLES.DARK_INACTIVE : TILE_STYLES.LIGHT_INACTIVE,
      });
      yOffset += 4;
      isFirst = false;

      Object.assign(output, board);
    }
    return output;
  }, [queue]);

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Upcoming Pieces
      </Text>
      <Grid items={flatQueue} width={4} height={18} />
    </View>
  );
};

export default Queue;
