/**
 * D-Pad component for directional movement controls.
 */

import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { GAME_COLORS, SPACING } from '@/constants/theme';
import type { Direction } from '../types';

interface DPadProps {
  onMove: (direction: Direction) => void;
  onPlace: () => void;
  onRotate: () => void;
  disabled?: boolean;
}

/**
 * D-Pad with directional buttons, center place button, and rotate button.
 */
export function DPad({ onMove, onPlace, onRotate, disabled = false }: DPadProps) {
  const buttonOpacity = disabled ? 0.5 : 1;

  return (
    <View style={styles.container}>
      {/* Top row - Up button */}
      <View style={styles.row}>
        <Pressable
          style={[styles.button, { opacity: buttonOpacity }]}
          onPress={() => !disabled && onMove('up')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>^</Text>
        </Pressable>
      </View>

      {/* Middle row - Left, Place, Right */}
      <View style={styles.row}>
        <Pressable
          style={[styles.button, { opacity: buttonOpacity }]}
          onPress={() => !disabled && onMove('left')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>{'<'}</Text>
        </Pressable>

        <Pressable
          style={[styles.centerButton, { opacity: buttonOpacity }]}
          onPress={() => !disabled && onPlace()}
          disabled={disabled}
        >
          <Text style={styles.placeText}>OK</Text>
        </Pressable>

        <Pressable
          style={[styles.button, { opacity: buttonOpacity }]}
          onPress={() => !disabled && onMove('right')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>{'>'}</Text>
        </Pressable>
      </View>

      {/* Bottom row - Down and Rotate buttons */}
      <View style={styles.row}>
        <Pressable
          style={[styles.button, { opacity: buttonOpacity }]}
          onPress={() => !disabled && onMove('down')}
          disabled={disabled}
        >
          <Text style={styles.arrow}>v</Text>
        </Pressable>

        <Pressable
          style={[styles.rotateButton, { opacity: buttonOpacity }]}
          onPress={() => !disabled && onRotate()}
          disabled={disabled}
        >
          <Text style={styles.rotateText}>ROT</Text>
        </Pressable>
      </View>
    </View>
  );
}

const BUTTON_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.SMALL.INT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  centerButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: GAME_COLORS.BUTTON_HIGHLIGHT,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 2,
  },
  arrow: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: 24,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  placeText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: 14,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  rotateButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.MEDIUM.INT,
  },
  rotateText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: 12,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default DPad;
