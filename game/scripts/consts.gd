extends Node
class_name Consts

const QUEUE_PREVIEW_ORIGIN = Vector2i(-17, 2)
const QUEUE_PREVIEW_END = QUEUE_PREVIEW_ORIGIN + Vector2i(7, 12)

const TARGET_GEM_ORIGIN = Vector2i(-9, 0)
const TARGET_GEM_END = TARGET_GEM_ORIGIN + Vector2i(Consts.MAX_GEM_WIDTH, Consts.MAX_GEM_HEIGHT)

const AVOID_GEM_ORIGIN = Vector2i(-9, 9)
const AVOID_GEM_END = AVOID_GEM_ORIGIN + Vector2i(Consts.MAX_GEM_WIDTH, Consts.MAX_GEM_HEIGHT)

enum Layer {
	Background = 0,
	Board = 1,
	Piece = 2,
}

const Sprite = {
	DarkInactive = Vector2i(0,0),
	DarkActive = Vector2i(1,0),
	LightInactive = Vector2i(2,0),
	LightActive = Vector2i(3,0),
	MidBorder = Vector2i(4,0),
	GemBlue = Vector2i(5,0),
}

#grid variables
const GRID = {
	HEIGHT = 10,
	WIDTH = 10
}

const PUZZLE_MODE_MAX_GEM_WIDTH := 3
const PUZZLE_MODE_MAX_GEM_HEIGHT := 3

const DAILY_MODE_MAX_GEM_WIDTH := 6
const DAILY_MODE_MAX_GEM_HEIGHT := 6

const MAX_GEM_WIDTH = max(PUZZLE_MODE_MAX_GEM_WIDTH, DAILY_MODE_MAX_GEM_WIDTH)
const MAX_GEM_HEIGHT = max(PUZZLE_MODE_MAX_GEM_HEIGHT, DAILY_MODE_MAX_GEM_HEIGHT)

const GEMS_TILE_ID := 0

const PLACE_PIECE_ON_BOARD_TIMER = 0.2
const DEBOUNCE_TIMER = 0.1
const LEVEL_COMPLETE_TIMER = 1
