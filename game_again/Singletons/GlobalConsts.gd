extends Node

enum GAME_MODE {
	ApprenticeshipGame,
	PuzzleGame,
	DailyGame
}

const GRID = { HEIGHT = 10, WIDTH = 10 }
const BOARD_ORIGIN = Vector2i(0, 0)
const BOARD_END = BOARD_ORIGIN + Vector2i(GRID.WIDTH, GRID.HEIGHT)

const BOARD_LAYER = {
	BORDER = 0,
	PLACED_PIECES = 1,
	CURRENT_PIECE = 2,
}

const CHALLENGE_GEM_LAYER = {
	BORDER = 0,
	PLACED_PIECES = 1,
	CURRENT_PIECE = 2,
}

# Currently only one layer.
const TARGET_GEM_LAYER = {
	BORDER = 0,
	GEM = 1
}

# Currently only one layer.
const QUEUE_LAYER = {
	BORDER = 0,
	QUEUE = 1
}

const MAX_GEM_SIZE = 6

const GEMS_TILE_ID := 0

const SPRITE = {
	EMPTY = Vector2i(-1, -1),
	DARK_INACTIVE = Vector2i(0,0),
	DARK_ACTIVE = Vector2i(1,0),
	LIGHT_INACTIVE = Vector2i(2,0),
	LIGHT_ACTIVE = Vector2i(3,0),
	MID_BORDER = Vector2i(4,0),
	GEM_BLUE_INACTIVE = Vector2i(5,0),
	GEM_BLUE_ACTIVE = Vector2i(6,0),
}

const ACTION = {
	UP = 'up',
	DOWN = 'down',
	LEFT = 'left',
	RIGHT = 'right',
	ROTATE = 'rotate',
	UNDO = 'undo',
	SELECT = 'select'
}
