import { useState, useEffect, useCallback } from "react";
import TabWrapper from "@/components/tab-wrapper";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { loadSettings, saveSettings, type GameSettings } from "@/services/storage";
import { updateAudioVolumes, playSound } from "@/services/audio";
import { GAME_COLORS, FONT_SIZES, SPACING } from "@/constants/theme";

const Settings = () => {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
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

  // Play test sound when SFX slider stops moving
  const handleSfxSlidingComplete = useCallback(() => {
    playSound('movement');
  }, []);

  if (isLoading || !settings) {
    return (
      <TabWrapper background="settings">
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </TabWrapper>
    );
  }

  return (
    <TabWrapper background="settings">
      <View style={styles.container}>
        <Text style={styles.title}>SETTINGS</Text>

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
        </View>

      </View>
    </TabWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.LARGE.INT,
    justifyContent: "center",
  },
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
  title: {
    fontFamily: "DepartureMonoRegular",
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.XLARGE.INT,
  },
  settingsContainer: {
    gap: SPACING.LARGE.INT,
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
});

export default Settings;
