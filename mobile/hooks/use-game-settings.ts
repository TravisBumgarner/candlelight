/**
 * useGameSettings - Common settings management for game screens.
 * Handles settings modal state and left-handed preference loading.
 */

import { useState, useCallback, useEffect } from 'react';
import { loadSettings } from '@/services/storage';

interface GameSettingsState {
  showSettings: boolean;
  leftHanded: boolean;
  isSettingsLoading: boolean;
}

interface GameSettingsActions {
  openSettings: () => void;
  closeSettings: () => Promise<void>;
  reloadSettings: () => Promise<void>;
}

type UseGameSettingsResult = GameSettingsState & GameSettingsActions;

/**
 * Hook that manages settings modal state and left-handed preference.
 * Automatically loads settings on mount and reloads when modal closes.
 */
export function useGameSettings(): UseGameSettingsResult {
  const [showSettings, setShowSettings] = useState(false);
  const [leftHanded, setLeftHanded] = useState(false);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const reloadSettings = useCallback(async () => {
    const settings = await loadSettings();
    setLeftHanded(settings.leftHanded);
    setIsSettingsLoading(false);
  }, []);

  // Load settings on mount
  useEffect(() => {
    reloadSettings();
  }, [reloadSettings]);

  const openSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(async () => {
    setShowSettings(false);
    // Reload settings in case handedness changed
    await reloadSettings();
  }, [reloadSettings]);

  return {
    showSettings,
    leftHanded,
    isSettingsLoading,
    openSettings,
    closeSettings,
    reloadSettings,
  };
}

export default useGameSettings;
