/**
 * FreePlayMenu - Save slot selection screen for Free Play mode.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GAME_COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import {
  FREE_PLAY_SLOTS,
  type FreePlaySlot,
  type FreePlaySlotInfo,
} from '../modes/free-play';
import {
  getFreePlaySlotInfos,
  deleteFreePlaySave,
} from '@/services/storage';

interface FreePlayMenuProps {
  onSelectSlot: (slot: FreePlaySlot, isNewGame: boolean) => void;
  onBack: () => void;
}

/**
 * Save slot button component.
 */
function SlotButton({
  slotInfo,
  onPress,
  onLongPress,
}: {
  slotInfo: FreePlaySlotInfo;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { slot, exists, level } = slotInfo;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.slotButton,
        pressed && styles.slotButtonPressed,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.slotLabel}>Save {slot}</Text>
      {exists ? (
        <Text style={styles.slotInfo}>Level {level}</Text>
      ) : (
        <Text style={styles.slotEmpty}>New Game</Text>
      )}
    </Pressable>
  );
}

/**
 * FreePlayMenu component.
 */
export function FreePlayMenu({ onSelectSlot, onBack }: FreePlayMenuProps) {
  const [slotInfos, setSlotInfos] = useState<FreePlaySlotInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load slot information
  const loadSlots = useCallback(async () => {
    setIsLoading(true);
    const infos = await getFreePlaySlotInfos(FREE_PLAY_SLOTS);
    setSlotInfos(infos);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadSlots();
  }, [loadSlots]);

  // Handle slot selection
  const handleSlotPress = useCallback(
    (slotInfo: FreePlaySlotInfo) => {
      if (slotInfo.exists) {
        // Show options for existing save
        Alert.alert(
          `Save ${slotInfo.slot}`,
          `Level ${slotInfo.level}`,
          [
            {
              text: 'Continue',
              onPress: () => onSelectSlot(slotInfo.slot, false),
            },
            {
              text: 'New Game',
              style: 'destructive',
              onPress: () => {
                Alert.alert(
                  'Start New Game?',
                  'This will erase your current progress.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'New Game',
                      style: 'destructive',
                      onPress: async () => {
                        await deleteFreePlaySave(slotInfo.slot);
                        onSelectSlot(slotInfo.slot, true);
                      },
                    },
                  ]
                );
              },
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        // No save - start new game directly
        onSelectSlot(slotInfo.slot, true);
      }
    },
    [onSelectSlot]
  );

  // Handle long press to delete
  const handleSlotLongPress = useCallback(
    (slotInfo: FreePlaySlotInfo) => {
      if (!slotInfo.exists) return;

      Alert.alert(
        'Delete Save?',
        `This will permanently delete Save ${slotInfo.slot}.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteFreePlaySave(slotInfo.slot);
              loadSlots();
            },
          },
        ]
      );
    },
    [loadSlots]
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GAME_COLORS.TEXT_PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FREE PLAY</Text>
      <Text style={styles.subtitle}>Select a save slot</Text>

      <View style={styles.slotsContainer}>
        {slotInfos.map((slotInfo) => (
          <SlotButton
            key={slotInfo.slot}
            slotInfo={slotInfo}
            onPress={() => handleSlotPress(slotInfo)}
            onLongPress={() => handleSlotLongPress(slotInfo)}
          />
        ))}
      </View>

      <Text style={styles.hint}>Long press to delete a save</Text>

      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1015',
    padding: SPACING.LARGE.INT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a1015',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SMALL.INT,
  },
  subtitle: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XLARGE.INT,
  },
  slotsContainer: {
    width: '100%',
    maxWidth: 300,
    gap: SPACING.MEDIUM.INT,
  },
  slotButton: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    padding: SPACING.MEDIUM.INT,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotButtonPressed: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
  },
  slotLabel: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  slotInfo: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  slotEmpty: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
  },
  hint: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    marginTop: SPACING.LARGE.INT,
    marginBottom: SPACING.XLARGE.INT,
  },
  backButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.XLARGE.INT,
    borderRadius: 4,
  },
  backButtonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default FreePlayMenu;
