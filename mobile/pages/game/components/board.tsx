import Text from "@/components/text";
import { Coordinate, Shape, TileType } from "@/types";
import { useMemo } from "react";
import { View } from "react-native";
import { BOARD_HEIGHT, BOARD_WIDTH } from "./game.consts";
import Grid from "./grid";

const Board = ({
  history,
  currentPiece,
}: {
  history: Shape[];
  currentPiece: Shape;
}) => {
  const flatHistory = useMemo(() => {
    const allCoordinates: {
      coordinate: Coordinate;
      type: TileType;
    }[] = [];

    history.forEach((shape, index) => {
      const tileType = index % 2 === 0 ? "black" : "white";
      shape.forEach((coordinate) => {
        allCoordinates.push({
          coordinate: coordinate,
          type: tileType,
        });
      });
    });

    return allCoordinates;
  }, [history]);

  console.log("doot", currentPiece[0]);
  const currentPieceTiles = currentPiece.map((coordinate) => ({
    coordinate,
    type: "gem" as const,
  }));

  const allItems = [...flatHistory, ...currentPieceTiles];

  return (
    <View>
      <Text variant="body1" textAlign="center">
        Board History
      </Text>
      <Grid items={allItems} width={BOARD_WIDTH} height={BOARD_HEIGHT} />
    </View>
  );
};

export default Board;
