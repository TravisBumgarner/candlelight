/**
 * TargetGem component for displaying the target gem pattern.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MAX_GEM_SIZE } from '../constants';
import { getCenteredGemCells } from '../engine';
import { GAME_COLORS, FONT_SIZES } from '@/constants/theme';
import type { Shape } from '../types';

interface TargetGemProps {
  gem: Shape;
  cellSize?: number;
  showLabel?: boolean;
}

/**
 * TargetGem component displays the target gem pattern centered in a display area.
 */
export function TargetGem({ gem, cellSize = 12, showLabel = true }: TargetGemProps) {
  const displaySize = cellSize * MAX_GEM_SIZE;

  // Get centered gem cells
  const centeredCells = useMemo(() => {
    return getCenteredGemCells(gem);
  }, [gem]);

  // Create a set for O(1) lookup
  const gemCellSet = useMemo(() => {
    const set = new Set<string>();
    for (const cell of centeredCells) {
      set.add(`${cell.x},${cell.y}`);
    }
    return set;
  }, [centeredCells]);

  // Render the grid
  const rows = useMemo(() => {
    const result: React.ReactNode[] = [];

    for (let y = 0; y < MAX_GEM_SIZE; y++) {
      const cells: React.ReactNode[] = [];

      for (let x = 0; x < MAX_GEM_SIZE; x++) {
        const key = `${x},${y}`;
        const isGemCell = gemCellSet.has(key);

        cells.push(
          <View
            key={key}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                backgroundColor: isGemCell
                  ? GAME_COLORS.GEM_COLOR
                  : 'transparent',
              },
            ]}
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
  }, [gemCellSet, cellSize]);

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>TARGET</Text>}
      <View
        style={[
          styles.gemContainer,
          {
            width: displaySize,
            height: displaySize,
          },
        ]}
      >
        {rows}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: 4,
  },
  gemContainer: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 1,
    borderColor: GAME_COLORS.BOARD_BORDER,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
});

export default TargetGem;
