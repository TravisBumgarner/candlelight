import { Coordinate, TileType } from "@/types";
import { StyleSheet, View } from "react-native";
import { CELL_SIZE } from "./game.consts";

interface BoardProps {
  items: { coordinate: Coordinate; type: TileType }[];
  width: number;
  height: number;
}

const Board = ({ items, width, height }: BoardProps) => {
  const totalCellsPerRow = width + 2; // Adding border cells (-1 to width inclusive)
  const gridWidth = CELL_SIZE * totalCellsPerRow; // Exact grid width
  const gridHeight = CELL_SIZE * (height + 2); // Height with borders

  const getTileColor = (row: number, col: number) => {
    // Check if it's a border cell
    const isBorder =
      row === -1 || row === height || col === -1 || col === width;
    if (isBorder) return "#ec2929";

    // Find if this coordinate exists in the items array
    const item = items.find(
      ({ coordinate }) => coordinate[0] === row && coordinate[1] === col
    );

    if (item) {
      // Color based on the tile type
      switch (item.type) {
        case "gem":
          return "#0080ff";
        case "wall":
          return "#fd0000"; // Dark gray
        case "white":
          return "#fff"; // White
        case "black":
          return "#000"; // Black
        case "empty":
          return "transparent";
        default:
          return "transparent";
      }
    }

    // Default to transparent for empty cells
    return "transparent";
  };

  const renderGrid = () => {
    const cells = [];

    for (let row = -1; row <= height; row++) {
      for (let col = -1; col <= width; col++) {
        cells.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              {
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: getTileColor(row, col),
              },
            ]}
          />
        );
      }
    }

    return cells;
  };

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.grid, { width: gridWidth, height: gridHeight }]}>
          {renderGrid()}
        </View>
      </View>
    </>
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
  cell: {
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
});

export default Board;
