import { Dimensions, StyleSheet, View } from "react-native";

const Board = () => {
  const screenWidth = Dimensions.get("window").width;
  const availableWidth = screenWidth - 40; // 40px padding
  const cellSize = Math.floor(availableWidth / 12); // Ensure integer size
  const gridWidth = cellSize * 12; // Exact grid width

  const renderGrid = () => {
    const cells = [];

    for (let row = -1; row <= 10; row++) {
      for (let col = -1; col <= 10; col++) {
        const isBorder = row === -1 || row === 10 || col === -1 || col === 10;

        cells.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                backgroundColor: isBorder ? "#333" : "#fff",
              },
            ]}
          />
        );
      }
    }

    return cells;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { width: gridWidth, height: gridWidth }]}>
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
  cell: {
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
});

export default Board;
