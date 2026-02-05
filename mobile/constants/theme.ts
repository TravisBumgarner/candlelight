/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const FONT_SIZES = {
  SMALL: {
    INT: 12,
  },
  MEDIUM: {
    INT: 20,
  },
  LARGE: {
    INT: 24,
  },
  HUGE: {
    INT: 32,
  },
  HUGE_PLUS: {
    INT: 48,
  },
} as const;

export const SPACING = {
  TINY: {
    INT: 4,
  },
  SMALL: {
    INT: 10,
  },
  MEDIUM: {
    INT: 20,
  },
  LARGE: {
    INT: 36,
  },
  XLARGE: {
    INT: 40,
  },
  HUGE: {
    INT: 48,
  },
  OMNIPRESENT: {
    INT: 128,
  },
} as const;

/**
 * Game-specific colors for the board and pieces.
 */
export const GAME_COLORS = {
  // Cell states
  CELL_EMPTY: 'transparent',
  CELL_DARK: '#2a4858',
  CELL_DARK_ACTIVE: '#4a7890',
  CELL_LIGHT: '#a8d4e6',
  CELL_LIGHT_ACTIVE: '#d4eef8',
  // Gem display
  GEM_COLOR: '#a8d4e6',
  // Board
  BOARD_BACKGROUND: '#1a2830',
  BOARD_BORDER: '#3a5868',
  // Queue
  QUEUE_INACTIVE: '#2a4858',
  QUEUE_ACTIVE: '#4a7890',
  // UI
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#a0b0b8',
  BUTTON_PRIMARY: '#3B7EA0',
  BUTTON_HIGHLIGHT: '#5bc1f4',
  // Backgrounds
  SCREEN_BACKGROUND: '#0a1015',
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.8)',
  OVERLAY_DARKER: 'rgba(0, 0, 0, 0.85)',
} as const;

/**
 * Shared style definitions to eliminate duplication across components.
 * Import and spread these into StyleSheet.create() calls.
 */
export const SHARED_STYLES = {
  // Modal/overlay backgrounds
  modalOverlay: {
    flex: 1,
    backgroundColor: GAME_COLORS.OVERLAY_DARK,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Menu container (used in pause menu, tutorial complete, etc.)
  menuContainer: {
    backgroundColor: GAME_COLORS.BOARD_BACKGROUND,
    borderWidth: 2,
    borderColor: GAME_COLORS.BOARD_BORDER,
    padding: SPACING.LARGE.INT,
    borderRadius: 8,
    minWidth: 250,
    alignItems: 'center' as const,
  },

  // Complete overlay (level complete, daily complete, etc.)
  completeOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: GAME_COLORS.OVERLAY_DARKER,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Loading container
  loadingContainer: {
    flex: 1,
    backgroundColor: GAME_COLORS.SCREEN_BACKGROUND,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Screen container
  screenContainer: {
    flex: 1,
    backgroundColor: GAME_COLORS.SCREEN_BACKGROUND,
    padding: SPACING.LARGE.INT,
  },

  // Back button style
  backButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.XLARGE.INT,
    borderRadius: 4,
    alignSelf: 'center' as const,
  },

  // Action button (used in overlays)
  actionButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    minWidth: 150,
    alignItems: 'center' as const,
  },

  // Menu button (used in pause menu, etc.)
  menuButton: {
    backgroundColor: GAME_COLORS.BUTTON_PRIMARY,
    paddingVertical: SPACING.SMALL.INT,
    paddingHorizontal: SPACING.LARGE.INT,
    borderRadius: 4,
    marginVertical: SPACING.TINY.INT,
  },

  // Standard button text
  buttonText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.MEDIUM.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center' as const,
  },

  // Title text (HUGE size, centered)
  titleText: {
    fontFamily: 'DepartureMonoRegular',
    fontSize: FONT_SIZES.HUGE.INT,
    color: GAME_COLORS.TEXT_PRIMARY,
    textAlign: 'center' as const,
  },

  // Board container
  boardContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
} as const;
