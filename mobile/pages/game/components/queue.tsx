import Text from "@/components/text";
import { Board, createBoardKey, PieceType, TILE_STYLES } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import { shapeKeyToVector } from "../utils";
import Grid from "./grid";

const Queue = ({ queue }: { queue: PieceType[] }) => {
  const flatQueue = useMemo(() => {
    const output: Board = {};

    let yOffset = 0;
    let isFirst = true;
    for (const shapeKey of queue) {
      const vector = shapeKeyToVector({
        key: shapeKey,
        offset: { x: 0, y: yOffset },
        rotationIndex: 0,
      });
      yOffset += 4;

      for (const coordinate of vector) {
        const boardKey = createBoardKey(coordinate);
        output[boardKey] = { type: TILE_STYLES.DARK_ACTIVE, coordinate };
      }
      if (!isFirst) yOffset += 4; // Add spacing between pieces

      isFirst = false;
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
