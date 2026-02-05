/**
 * GameBoard component for rendering the 13x13 game grid.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { GRID } from '../constants';
import { GAME_COLORS } from '@/constants/theme';
import type { Board, CellState, Point } from '../types';

interface PlayerCell {
  point: Point;
  state: 'dark' | 'light';
}

interface GameBoardProps {
  board: Board;
  playerCells?: PlayerCell[];
  disabled?: boolean;
}

/**
 * Get the color for a cell based on its state and whether it's part of the player shape.
 */
function getCellColor(
  cellState: CellState,
  isPlayerCell: boolean,
  playerOverlayState?: 'dark' | 'light'
): string {
  if (isPlayerCell && playerOverlayState) {
    return playerOverlayState === 'dark'
      ? GAME_COLORS.CELL_DARK_ACTIVE
      : GAME_COLORS.CELL_LIGHT_ACTIVE;
  }

  switch (cellState) {
    case 'empty':
      return GAME_COLORS.CELL_EMPTY;
    case 'dark':
      return GAME_COLORS.CELL_DARK;
    case 'light':
      return GAME_COLORS.CELL_LIGHT;
  }
}

/**
 * Single cell component.
 */
const Cell = React.memo(function Cell({
  cellState,
  isPlayerCell,
  playerOverlayState,
  size,
}: {
  cellState: CellState;
  isPlayerCell: boolean;
  playerOverlayState?: 'dark' | 'light';
  size: number;
}) {
  const backgroundColor = getCellColor(cellState, isPlayerCell, playerOverlayState);

  return (
    <View
      style={[
        styles.cell,
        {
          width: size,
          height: size,
          backgroundColor,
        },
      ]}
    />
  );
});

/**
 * GameBoard component.
 */
export function GameBoard({ board, playerCells = [], disabled = false }: GameBoardProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // Calculate cell size based on available space
  const horizontalPadding = 40;
  const availableWidth = screenWidth - horizontalPadding;

  // Leave room for HUD, target gem, queue, and controls
  const verticalPadding = 280;
  const availableHeight = screenHeight - verticalPadding;

  // Use the smaller dimension to ensure board fits
  const maxBoardSize = Math.min(availableWidth, availableHeight);
  const cellSize = Math.floor(maxBoardSize / GRID.WIDTH);
  const boardSize = cellSize * GRID.WIDTH;

  // Create a lookup map for player cells for O(1) access
  const playerCellMap = useMemo(() => {
    const map = new Map<string, 'dark' | 'light'>();
    for (const cell of playerCells) {
      map.set(`${cell.point.x},${cell.point.y}`, cell.state);
    }
    return map;
  }, [playerCells]);

  // Render the grid
  const rows = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let y = 0; y < GRID.HEIGHT; y++) {
      const cells: React.ReactNode[] = [];

      for (let x = 0; x < GRID.WIDTH; x++) {
        const cellState = board[x]?.[y] ?? 'empty';
        const key = `${x},${y}`;
        const playerOverlayState = playerCellMap.get(key);
        const isPlayerCell = playerOverlayState !== undefined;

        cells.push(
          <Cell
            key={key}
            cellState={cellState}
            isPlayerCell={isPlayerCell}
            playerOverlayState={playerOverlayState}
            size={cellSize}
          />
        );
      }

      result.push(
        <View key={`row-${y}`} style={styles.row}>
          {cells}
        </View>
      );
    }

    return result;
  }, [board, playerCellMap, cellSize]);

  return (
    <View
      style={[
        styles.container,
        {
          width: boardSize,
          height: boardSize,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      {rows}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default GameBoard;
