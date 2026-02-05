/**
 * Game engine module exports.
 */

// Utilities
export {
  isCellInRange,
  isCellBorder,
  getValidNeighbors,
  moveCellsToOrigin,
  SeededRandom,
  generateKeyFromDate,
  getDailyPuzzleDate,
  hashString,
  createPuzzleId,
  parsePuzzleId,
  isLessThanWorldLevel,
  shapesEqual,
  addPoints,
  pointsEqual,
  deepClone,
} from './utils';

// Board
export {
  createEmptyBoard,
  clearBoard,
  getCellState,
  setCellState,
  isCellBorder as isBoardCellBorder,
  cloneBoard,
  boardToArray,
  arrayToBoard,
  toggleCellState,
  getPlayerOverlayState,
  countCells,
  getCellsWithState,
} from './board';

// Player
export {
  createPlayer,
  getCurrentShapeRotation,
  getAbsoluteShapeCells,
  canMove,
  move,
  canRotate,
  rotate,
  canPlace,
  placeOnBoard,
  getPlayerOverlay,
  isInvalidPosition,
} from './player';

// Queue
export type { QueueOptions } from './queue';
export {
  createQueue,
  fillQueue,
  next as nextFromQueue,
  undo as undoQueue,
  getQueue,
  getQueueSize,
  loadQueue,
  getVisibleQueue,
  isEmpty as isQueueEmpty,
  appendToQueue,
  queueFromSave,
} from './queue';

// History
export {
  createHistory,
  push as pushHistory,
  pop as popHistory,
  clear as clearHistory,
  size as historySize,
  isEmpty as isHistoryEmpty,
  getHistory,
  loadHistory,
  peek as peekHistory,
  historyToSave,
  historyFromSave,
} from './history';

// Gems Manager
export {
  freePlayLevelToGemSize,
  generateGem,
  dailyModeGenerateGem,
  freePlayModeGenerateGem,
  findShapes,
  isTargetGem,
  findGemsAndShapes,
  getShapeBounds,
  getCenterOffset,
  getCenteredGemCells,
} from './gems-manager';
