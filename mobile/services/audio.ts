/**
 * Audio service for music and sound effects using expo-av.
 */

import { Audio, AVPlaybackStatus, AVPlaybackSource } from 'expo-av';
import { loadSettings } from './storage';

// Sound effect names
export type SoundName = 'movement' | 'non_movement' | 'one_gem' | 'two_gems';

// Music track names
export type MusicName = 'intro' | 'gameplay';

// Audio file imports (require returns a number for static assets in React Native)
const MUSIC_FILES: Record<MusicName, AVPlaybackSource> = {
  intro: require('@/assets/audio/music/intro.mp3'),
  gameplay: require('@/assets/audio/music/gameplay.mp3'),
};

const SOUND_FILES: Record<SoundName, AVPlaybackSource> = {
  movement: require('@/assets/audio/sounds/movement.wav'),
  non_movement: require('@/assets/audio/sounds/non_movement.wav'),
  one_gem: require('@/assets/audio/sounds/1gem.wav'),
  two_gems: require('@/assets/audio/sounds/2gems.wav'),
};

/**
 * Audio manager singleton for handling music and sound effects.
 */
class AudioManager {
  private musicSound: Audio.Sound | null = null;
  private currentMusic: MusicName | null = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.5;
  private isInitialized: boolean = false;
  private soundCache: Map<SoundName, Audio.Sound> = new Map();

  /**
   * Initialize the audio manager and load settings.
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set audio mode for background playback
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load volume settings
      const settings = await loadSettings();
      this.musicVolume = settings.musicVolume;
      this.sfxVolume = settings.sfxVolume;

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  /**
   * Update volume settings.
   */
  async updateVolumes(musicVolume: number, sfxVolume: number): Promise<void> {
    this.musicVolume = musicVolume;
    this.sfxVolume = sfxVolume;

    // Update currently playing music volume
    if (this.musicSound) {
      await this.musicSound.setVolumeAsync(this.musicVolume);
    }
  }

  /**
   * Play background music.
   */
  async playMusic(name: MusicName): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Don't restart if same track is already playing
    if (this.currentMusic === name && this.musicSound) {
      const status = await this.musicSound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        return;
      }
    }

    // Stop current music
    await this.stopMusic();

    try {
      const { sound } = await Audio.Sound.createAsync(
        MUSIC_FILES[name],
        {
          isLooping: true,
          volume: this.musicVolume,
        }
      );

      this.musicSound = sound;
      this.currentMusic = name;
      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play music:', error);
    }
  }

  /**
   * Stop background music.
   */
  async stopMusic(): Promise<void> {
    if (this.musicSound) {
      try {
        await this.musicSound.stopAsync();
        await this.musicSound.unloadAsync();
      } catch (error) {
        console.error('Failed to stop music:', error);
      }
      this.musicSound = null;
      this.currentMusic = null;
    }
  }

  /**
   * Pause background music.
   */
  async pauseMusic(): Promise<void> {
    if (this.musicSound) {
      try {
        await this.musicSound.pauseAsync();
      } catch (error) {
        console.error('Failed to pause music:', error);
      }
    }
  }

  /**
   * Resume background music.
   */
  async resumeMusic(): Promise<void> {
    if (this.musicSound) {
      try {
        await this.musicSound.playAsync();
      } catch (error) {
        console.error('Failed to resume music:', error);
      }
    }
  }

  /**
   * Play a sound effect.
   */
  async playSound(name: SoundName): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.sfxVolume === 0) return;

    try {
      // Create a new sound instance for each play to allow overlapping
      const { sound } = await Audio.Sound.createAsync(
        SOUND_FILES[name],
        {
          volume: this.sfxVolume,
        }
      );

      // Auto-unload when done
      sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });

      await sound.playAsync();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }

  /**
   * Clean up all audio resources.
   */
  async cleanup(): Promise<void> {
    await this.stopMusic();

    // Unload cached sounds
    for (const sound of this.soundCache.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.soundCache.clear();
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Convenience functions
export const playMusic = (name: MusicName) => audioManager.playMusic(name);
export const stopMusic = () => audioManager.stopMusic();
export const pauseMusic = () => audioManager.pauseMusic();
export const resumeMusic = () => audioManager.resumeMusic();
export const playSound = (name: SoundName) => audioManager.playSound(name);
export const updateAudioVolumes = (musicVolume: number, sfxVolume: number) =>
  audioManager.updateVolumes(musicVolume, sfxVolume);
export const initializeAudio = () => audioManager.initialize();
