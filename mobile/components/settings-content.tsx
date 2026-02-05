/**
 * SettingsContent - Shared settings UI component.
 * Used by both the settings tab and the in-game settings modal.
 */

import { useState, useEffect, useCallback } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { loadSettings, saveSettings, type GameSettings } from "@/services/storage";
import { updateAudioVolumes, playSound } from "@/services/audio";
import { GAME_COLORS, FONT_SIZES, SPACING } from "@/constants/theme";

interface SettingsContentProps {
  onSettingsChange?: () => void;
}

export function SettingsContent({ onSettingsChange }: SettingsContentProps) {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const loaded = await loadSettings();
      setSettings(loaded);
      setIsLoading(false);
    };
    load();
  }, []);

  const handleMusicVolumeChange = useCallback(async (value: number) => {
    if (!settings) return;
    const newSettings = { ...settings, musicVolume: value };
    setSettings(newSettings);
    await saveSettings({ musicVolume: value });
    await updateAudioVolumes(value, settings.sfxVolume);
  }, [settings]);

  const handleSfxVolumeChange = useCallback(async (value: number) => {
    if (!settings) return;
    const newSettings = { ...settings, sfxVolume: value };
    setSettings(newSettings);
    await saveSettings({ sfxVolume: value });
    await updateAudioVolumes(settings.musicVolume, value);
  }, [settings]);

  const handleSfxSlidingComplete = useCallback(() => {
    playSound('movement');
  }, []);

  const handleHandednessToggle = useCallback(async () => {
    if (!settings) return;
    const newValue = !settings.leftHanded;
    const newSettings = { ...settings, leftHanded: newValue };
    setSettings(newSettings);
    await saveSettings({ leftHanded: newValue });
    playSound('movement');
    onSettingsChange?.();
  }, [settings, onSettingsChange]);

  if (isLoading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.settingsContainer}>
      {/* Music Volume */}
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Music</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={settings.musicVolume}
            onValueChange={handleMusicVolumeChange}
            minimumTrackTintColor={GAME_COLORS.BUTTON_HIGHLIGHT}
            maximumTrackTintColor={GAME_COLORS.BOARD_BORDER}
            thumbTintColor={GAME_COLORS.TEXT_PRIMARY}
          />
          <Text style={styles.valueText}>
            {Math.round(settings.musicVolume * 100)}%
          </Text>
        </View>
      </View>

      {/* SFX Volume */}
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Sound Effects</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={settings.sfxVolume}
            onValueChange={handleSfxVolumeChange}
            onSlidingComplete={handleSfxSlidingComplete}
            minimumTrackTintColor={GAME_COLORS.BUTTON_HIGHLIGHT}
            maximumTrackTintColor={GAME_COLORS.BOARD_BORDER}
            thumbTintColor={GAME_COLORS.TEXT_PRIMARY}
          />
          <Text style={styles.valueText}>
            {Math.round(settings.sfxVolume * 100)}%
          </Text>
        </View>
      </View>

      {/* Controls Layout */}
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Controls Layout</Text>
        <View style={styles.toggleContainer}>
          <Pressable
            style={[
              styles.toggleOption,
              settings.leftHanded && styles.toggleOptionActive,
            ]}
            onPress={handleHandednessToggle}
          >
            <Text
              style={[
                styles.toggleText,
                settings.leftHanded && styles.toggleTextActive,
              ]}
            >
              Left Hand
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.toggleOption,
              !settings.leftHanded && styles.toggleOptionActive,
            ]}
            onPress={handleHandednessToggle}
          >
            <Text
              style={[
                styles.toggleText,
                !settings.leftHanded && styles.toggleTextActive,
              ]}
            >
              Right Hand
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.LARGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
  },
  settingsContainer: {
    gap: SPACING.SMALL.INT,
  },
  settingRow: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    borderRadius: 8,
    padding: SPACING.MEDIUM.INT,
  },
  settingLabel: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SMALL.INT,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.MEDIUM.INT,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  valueText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
    width: 50,
    textAlign: "right",
  },
  toggleContainer: {
    flexDirection: "row",
    gap: SPACING.SMALL.INT,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.MEDIUM.INT,
    borderRadius: 4,
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    alignItems: "center",
  },
  toggleOptionActive: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    borderColor: GAME_COLORS.BUTTON_HIGHLIGHT,
  },
  toggleText: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.SMALL.INT,
    color: GAME_COLORS.TEXT_SECONDARY,
  },
  toggleTextActive: {
    color: GAME_COLORS.TEXT_PRIMARY,
  },
});

export default SettingsContent;
