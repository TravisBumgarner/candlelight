# Candlelight Mobile Port Design

## Overview

This document describes the implementation plan for porting the Candlelight desktop game (Godot) to iOS using React Native/Expo.

**Source**: `desktop/game/` (Godot 4.3)
**Target**: `mobile/` (Expo/React Native)

## Game Description

Candlelight is a tile-matching puzzle game where players place Tetris-like shapes on a 13x13 grid to match target patterns (gems). The game features:

- **7 shapes**: upper_l, square, u, lower_z, upper_z, w, t (each with 4 rotations)
- **Core mechanic**: Place shapes to create connected regions matching target gems
- **Scoring**: Lower score (fewer placements) is better
- **Undo system**: Full move history allowing players to undo placements

## Scope

### In Scope
- Tutorial Mode
- Free Play Mode
- Daily Mode (date-seeded challenges)
- Puzzle Mode (campaign with 9 worlds, 52 levels)
- Settings screen (audio controls)
- Credits screen
- Persistence (save/load, high scores, preferences)
- Audio system (music + SFX)

### Out of Scope
- Level Designer (desktop-only feature)

## Architecture

### State Management
Use Zustand for global state (already installed):
- `useGameStore` - Current game state (mode, board, player, queue, etc.)
- `useSettingsStore` - User preferences (audio levels)
- `usePersistenceStore` - Save/load operations

### Directory Structure
```
mobile/
├── app/                    # Expo Router screens
│   └── (tabs)/
├── components/             # Shared UI components
├── constants/              # Theme, game constants
├── game/                   # Game engine (NEW)
│   ├── types.ts           # Type definitions
│   ├── constants.ts       # Game constants (grid size, sprites, etc.)
│   ├── shapes.ts          # Shape definitions with rotations
│   ├── engine/            # Core game logic
│   │   ├── board.ts       # Board state management
│   │   ├── player.ts      # Player position, movement, placement
│   │   ├── gems-manager.ts # Gem generation for Free Play and gem matching logic
│   │   ├── queue.ts       # Shape queue management
│   │   └── history.ts     # Undo system
│   ├── modes/             # Game mode implementations
│   │   ├── base-game.ts   # Shared game loop logic
│   │   ├── tutorial.ts
│   │   ├── free-play.ts
│   │   ├── daily.ts
│   │   └── puzzle.ts
│   └── components/        # Game-specific UI
│       ├── game-board.tsx # Main game board renderer
│       ├── target-gem.tsx # Target gem display
│       ├── queue-display.tsx # Upcoming shapes
│       ├── game-controls.tsx # Touch controls
│       └── game-hud.tsx   # Score, level info
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores (NEW)
├── data/                   # Level data (NEW)
│   └── puzzle-levels/     # Puzzle mode level configs
└── tabs/                   # Tab-specific code
```

## Core Types

```typescript
// Vector2i equivalent
type Point = { x: number; y: number };

// Shape name type
type ShapeName = 'upper_l' | 'square' | 'u' | 'lower_z' | 'upper_z' | 'w' | 't';

// Cell state on the board
type CellState = 'empty' | 'dark' | 'light';

// Board is a 13x13 grid
type Board = CellState[][];

// A gem/shape is an array of relative points
type Shape = Point[];

// Game modes
type GameMode = 'tutorial' | 'freeplay' | 'daily' | 'puzzle';

// Player state
interface PlayerState {
  position: Point;
  shapeName: ShapeName;
  rotationIndex: number;
}

// History record for undo
interface HistoryRecord {
  board: Board;
  shapeName: ShapeName;
}
```

## Game Constants

```typescript
const GRID = { WIDTH: 13, HEIGHT: 13 };
const STARTING_POSITION = { x: 5, y: 5 };
const MAX_GEM_SIZE = 6;
const TOTAL_ROTATIONS = 4;
const VISIBLE_QUEUE_SIZE = 3;
```

## Touch Controls

Mobile uses swipe and tap gestures:
- **Swipe up/down/left/right**: Move shape
- **Tap**: Place shape
- **Two-finger tap or dedicated button**: Rotate
- **Dedicated button**: Undo
- **Dedicated button**: Pause/menu

Consider using `react-native-gesture-handler` for gesture detection.

## Rendering Approach

Use React Native Views with absolute positioning for the grid-based board. Each cell is a fixed-size square. Colors:
- Empty: transparent
- Dark (inactive): dark color
- Dark (active/current shape): highlighted dark
- Light (inactive): light color
- Light (active/current shape): highlighted light

## Persistence

Use `expo-secure-store` or `AsyncStorage` for:
- Free Play saves (board state, level, queue, history)
- Puzzle progress (unlocked levels, best scores per level)
- Daily best scores (keyed by date)
- Settings (audio volumes, first-time flag)

## Audio

Use `expo-av` for audio playback:
- Music: gameplay track
- SFX: movement, non-movement, one_gem, two_gems

## Level Data

Puzzle levels will be bundled as JSON. Convert the Godot .cfg format to JSON:
```typescript
interface PuzzleLevel {
  worldNumber: number;
  levelNumber: number;
  queue: ShapeName[];
  targetGem: Point[];
}
```

## Navigation Flow

```
Main Menu (Game Tab)
├── Tutorial → Tutorial Game Screen
├── Puzzle → World Select → Level Select → Puzzle Game Screen
├── Free Play → Save Slot Select → Free Play Game Screen
└── Daily → Daily Game Screen

Settings Tab → Settings Screen
Credits Tab → Credits Screen
```

## Key Implementation Notes

1. **Gem Matching**: Uses flood-fill algorithm to find connected light-colored regions, then compares to target gem shape (normalized to origin).

2. **Daily Challenge**: Uses date as seed for RNG to generate same puzzle for all players on a given day.

3. **Free Play Progression**: Gem size increases with level (1-15 cells over 66+ levels).

4. **Tutorial Stages**: 6 progressive stages teaching movement, placement, stacking, undo, scoring, and queue.

5. **Puzzle Mode**: Pre-defined queue and target gem. Game over if queue exhausted without matching.
