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
} as const;
