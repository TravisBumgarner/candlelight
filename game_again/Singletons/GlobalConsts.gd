extends Node

const GRID = { HEIGHT = 10, WIDTH = 10 }
const BOARD_ORIGIN = Vector2i(0, 0)
const BOARD_END = BOARD_ORIGIN + Vector2i(GRID.WIDTH, GRID.HEIGHT)

const BOARD_LAYER = {
	BORDER = 0,
	PLACED_PIECES = 1,
	CURRENT_PIECE = 2,
}

const GEMS_TILE_ID := 0

const SPRITE = {
	DARK_INACTIVE = Vector2i(0,0),
	DARK_ACTIVE = Vector2i(1,0),
	LIGHT_INACTIVE = Vector2i(2,0),
	LIGHT_ACTIVE = Vector2i(3,0),
	MID_BORDER = Vector2i(4,0),
	GEM_BLUE = Vector2i(5,0),
}
