import { Board as TBoard, TILE_STYLES } from "@/types";
import { StyleSheet, View } from "react-native";
import { CELL_SIZE, SPRITE_SCALING } from "./game.consts";
import { Tile } from "./tile";

interface BoardProps {
  items: TBoard;
  width: number;
  height: number;
}

const Grid = ({ items, width, height }: BoardProps & { scale?: number }) => {
  const scaledCellSize = CELL_SIZE * SPRITE_SCALING;

  const totalCellsPerRow = width + 2; // borders included
  const gridWidth = scaledCellSize * totalCellsPerRow;
  const gridHeight = scaledCellSize * (height + 2);

  const renderGrid = () => {
    const cells = [];

    for (let row = -1; row <= height; row++) {
      for (let col = -1; col <= width; col++) {
        const key = `${row}-${col}`;
        const isBorder =
          row === -1 || row === height || col === -1 || col === width;
        const type = isBorder
          ? TILE_STYLES.MID_BORDER
          : items[`${col}_${row}`]?.type;

        cells.push(<Tile key={key} type={type} size={scaledCellSize} />);
      }
    }

    return cells;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { width: gridWidth, height: gridHeight }]}>
        {renderGrid()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default Grid;
