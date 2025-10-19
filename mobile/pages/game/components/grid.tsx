import { Board as TBoard, TILE_STYLES } from "@/types";
import { StyleSheet, View } from "react-native";
import { CELL_SIZE } from "./game.consts";

interface BoardProps {
  items: TBoard;
  width: number;
  height: number;
}

const Grid = ({ items, width, height }: BoardProps) => {
  const totalCellsPerRow = width + 2; // Adding border cells (-1 to width inclusive)
  const gridWidth = CELL_SIZE * totalCellsPerRow; // Exact grid width
  const gridHeight = CELL_SIZE * (height + 2); // Height with borders

  const getTileColor = ({
    col,
    row,
    width,
    height,
  }: {
    col: number;
    row: number;
    width: number;
    height: number;
  }) => {
    // Check if it's a border cell
    const isBorder =
      row === -1 || row === height || col === -1 || col === width;
    if (isBorder) return "#ec2929";

    // Find if this coordinate exists in the board
    const tile = items[`${col}_${row}`];

    if (tile) {
      // Color based on the tile type
      switch (tile.type) {
        case TILE_STYLES.DARK_ACTIVE:
          return "#0080ff";
        case TILE_STYLES.DARK_INACTIVE:
          return "#fd0000"; // Dark gray
        case TILE_STYLES.LIGHT_ACTIVE:
          return "#00ff4c"; // Light green
        case TILE_STYLES.LIGHT_INACTIVE:
          return "#ffe600"; // Light yellow
        case TILE_STYLES.GEM_BLUE_ACTIVE:
          return "#00ffff"; // Cyan for active gem
        case TILE_STYLES.GEM_BLUE_INACTIVE:
          return "#0000ff"; // Blue for inactive gem
        case TILE_STYLES.MID_BORDER:
          return "#a0a0a0"; // Medium gray for mid border

        case TILE_STYLES.EMPTY:
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
                backgroundColor: getTileColor({
                  col,
                  row,
                  width,
                  height,
                }),
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

export default Grid;
