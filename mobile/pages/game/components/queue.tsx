import Text from "@/components/text";
import { Coordinate, Shape, TileType } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import Grid from "./grid";

const Queue = ({ queue }: { queue: Shape[] }) => {
  const flatQueue = useMemo(() => {
    const output: { coordinate: Coordinate; type: TileType }[] = [];

    let yOffset = 0;
    let isFirst = true;
    for (const shape of queue) {
      for (const coordinate of shape) {
        const offsetCoordinate: Coordinate = [
          coordinate[0] + yOffset,
          coordinate[1],
        ];
        output.push({
          coordinate: offsetCoordinate,
          type: isFirst ? "white" : "black",
        });
      }
      yOffset += 4;
      isFirst = false;
    }
    return output;
  }, [queue]);

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Upcoming Pieces
      </Text>
      <Grid items={flatQueue} width={4} height={flatQueue.length} />
    </View>
  );
};

export default Queue;
