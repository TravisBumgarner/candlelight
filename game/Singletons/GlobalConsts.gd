extends Node

enum GAME_MODE {
	TutorialMode,
	FreePlayGame,
	DailyGame,
	PuzzleGame
}

const GRID = { HEIGHT = 10, WIDTH = 13 }
const BOARD_ORIGIN = Vector2i(0, 0)
const BOARD_END = BOARD_ORIGIN + Vector2i(GRID.WIDTH, GRID.HEIGHT)

const STARTING_SPACE_ORIGIN = Vector2i(5, -3)

const BOARD_LAYER = {
	BORDER = 0,
	PLACED_SHAPES = 1,
	BLOCKERS = 2,
	CURRENT_SHAPE = 3,
}

const CHALLENGE_GEM_LAYER = {
	BORDER = 0,
	PLACED_SHAPES = 1,
	CURRENT_SHAPE = 2,
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
const MAX_PLAYER_SIZE = 3

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
	INVALID_MOVE = Vector2i(8,0),
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

const GAME_SAVE_KEYS = {
	FREE_PLAY_GAME = "free_play_game_saves"
}

const CONFIG_FILE_SAVE_KEY = "game_save"

const FREE_PLAY_GAME_SAVE_KEY = {
	LEVEL = 'level',
	ALCHEMIZATIONS = 'alchemizations',
	QUEUE = 'queue',
	GAME_START_TIMESTAMP = 'game_start_timestamp',
	HISTORY = 'history',
	PLAYER_SHAPE = 'player_shape',
	PLAYER_NAME = 'player_name',
	PLACED_SHAPES = 'placed_shapes',
	BLOCKERS = 'blockers',
	TARGET_GEM = 'target_gem'
}

const PUZZLE_GAME_SAVE_KEY = {
	#LEVEL = 'level',
	#ALCHEMIZATIONS = 'alchemizations',
	QUEUE = 'queue',
	#GAME_START_TIMESTAMP = 'game_start_timestamp',
	#HISTORY = 'history',
	#PLAYER_SHAPE = 'player_shape',
	#PLAYER_NAME = 'player_name',
	#PLACED_SHAPES = 'placed_shapes',
	#BLOCKERS = 'blockers',
	TARGET_GEM = 'target_gem'
}

