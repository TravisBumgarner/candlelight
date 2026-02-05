/**
 * QueueDisplay component for showing upcoming shapes.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { VISIBLE_QUEUE_SIZE } from '../constants';
import { getShapeRotation } from '../shapes';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import type { ShapeName, Point } from '../types';

interface QueueDisplayProps {
  queue: ShapeName[];
  cellSize?: number;
  showLabel?: boolean;
}

/**
 * Render a single shape in the queue.
 */
function QueueShape({
  shapeName,
  isNext,
  cellSize,
}: {
  shapeName: ShapeName;
  isNext: boolean;
  cellSize: number;
}) {
  // Always use rotation 0 for queue display
  const shapeCells = getShapeRotation(shapeName, 0);

  // Find bounding box
  const minX = Math.min(...shapeCells.map((c) => c.x));
  const maxX = Math.max(...shapeCells.map((c) => c.x));
  const minY = Math.min(...shapeCells.map((c) => c.y));
  const maxY = Math.max(...shapeCells.map((c) => c.y));

  const width = maxX - minX + 1;
  const height = maxY - minY + 1;

  // Normalize cells to start at 0,0
  const normalizedCells = shapeCells.map((c) => ({
    x: c.x - minX,
    y: c.y - minY,
  }));

  // Create cell lookup
  const cellSet = new Set(normalizedCells.map((c) => `${c.x},${c.y}`));

  // Render grid
  const rows: React.ReactNode[] = [];
  for (let y = 0; y < height; y++) {
    const cells: React.ReactNode[] = [];
    for (let x = 0; x < width; x++) {
      const isShapeCell = cellSet.has(`${x},${y}`);
      cells.push(
        <View
          key={`${x},${y}`}
          style={[
            styles.shapeCell,
            {
              width: cellSize,
              height: cellSize,
              backgroundColor: isShapeCell
                ? isNext
                  ? GAME_COLORS.QUEUE_ACTIVE
                  : GAME_COLORS.QUEUE_INACTIVE
                : 'transparent',
            },
          ]}
        />
      );
    }
    rows.push(
      <View key={`row-${y}`} style={styles.shapeRow}>
        {cells}
      </View>
    );
  }

  return (
    <View style={styles.shapeContainer}>
      {rows}
    </View>
  );
}

/**
 * QueueDisplay component shows the upcoming shapes.
 */
export function QueueDisplay({
  queue,
  cellSize = 10,
  showLabel = true,
}: QueueDisplayProps) {
  const visibleQueue = queue.slice(0, VISIBLE_QUEUE_SIZE);

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>NEXT</Text>}
      <View style={styles.queueContainer}>
        {visibleQueue.map((shapeName, index) => (
          <QueueShape
            key={`${shapeName}-${index}`}
            shapeName={shapeName}
            isNext={index === 0}
            cellSize={cellSize}
          />
        ))}
        {/* Fill empty slots if queue is short */}
        {visibleQueue.length < VISIBLE_QUEUE_SIZE &&
          Array.from({ length: VISIBLE_QUEUE_SIZE - visibleQueue.length }).map(
            (_, index) => (
              <View
                key={`empty-${index}`}
                style={[styles.shapeContainer, styles.emptySlot]}
              />
            )
          )}
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
  queueContainer: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 1,
    borderColor: GAME_COLORS.BOARD_BORDER,
    padding: SPACING.SMALL.INT,
    gap: SPACING.SMALL.INT,
  },
  shapeContainer: {
    minHeight: 30,
    minWidth: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeRow: {
    flexDirection: 'row',
  },
  shapeCell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptySlot: {
    opacity: 0.3,
  },
});

export default QueueDisplay;
