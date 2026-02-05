/**
 * Consolidated game controls with D-pad, rotate, place, undo.
 * Also displays game info (target gem + score) on the opposite side.
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { GAME_COLORS, SPACING } from '@/constants/theme';
import type { Direction } from '../types';

interface GameControlsPadProps {
  onMove: (direction: Direction) => void;
  onRotate: () => void;
  onPlace: () => void;
  onUndo: () => void;
  disabled?: boolean;
  leftHanded?: boolean;
  children?: ReactNode; // Info panel (target gem + score)
}

const BUTTON_SIZE = 56;

/**
 * Bottom controls row with game info on one side and controls on the other.
 * Right-handed: info on left, controls on right
 * Left-handed: controls on left, info on right
 */
export function GameControlsPad({
  onMove,
  onRotate,
  onPlace,
  onUndo,
  disabled = false,
  leftHanded = false,
  children,
}: GameControlsPadProps) {
  const opacity = disabled ? 0.5 : 1;

  const controlsGrid = (
    <View style={styles.grid}>
      {/* Row 1: undo, up, place */}
      <View style={styles.gridRow}>
        <Pressable
          style={[styles.button, styles.secondaryButton, { opacity }]}
          onPress={() => !disabled && onUndo()}
          disabled={disabled}
        >
          <Text style={styles.icon}>↩</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.primaryButton, { opacity }]}
          onPress={() => !disabled && onMove('up')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>▲</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.highlightButton, { opacity }]}
          onPress={() => !disabled && onPlace()}
          disabled={disabled}
        >
          <Text style={styles.icon}>✓</Text>
        </Pressable>
      </View>

      {/* Row 2: left, rotate, right */}
      <View style={styles.gridRow}>
        <Pressable
          style={[styles.button, styles.primaryButton, { opacity }]}
          onPress={() => !disabled && onMove('left')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>◀</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.secondaryButton, { opacity }]}
          onPress={() => !disabled && onRotate()}
          disabled={disabled}
        >
          <Text style={styles.icon}>↻</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.primaryButton, { opacity }]}
          onPress={() => !disabled && onMove('right')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>▶</Text>
        </Pressable>
      </View>

      {/* Row 3: empty, down, empty */}
      <View style={styles.gridRow}>
        <View style={styles.emptyCell} />
        <Pressable
          style={[styles.button, styles.primaryButton, { opacity }]}
          onPress={() => !disabled && onMove('down')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>▼</Text>
        </Pressable>
        <View style={styles.emptyCell} />
      </View>
    </View>
  );

  const infoSection = (
    <View style={styles.infoSection}>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      {leftHanded ? (
        <>
          {controlsGrid}
          {infoSection}
        </>
      ) : (
        <>
          {infoSection}
          {controlsGrid}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.SMALL.INT,
  },
  infoSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: SPACING.SMALL.INT,
  },
  grid: {
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  primaryButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
  },
  secondaryButton: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
  },
  highlightButton: {
    backgroundColor: GAME_COLORS.BUTTON_HIGHLIGHT,
  },
  emptyCell: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    margin: 2,
  },
  arrow: {
    fontSize: 20,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  icon: {
    fontSize: 24,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default GameControlsPad;
