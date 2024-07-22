extends Node
class_name Consts

const QUEUE_PREVIEW_ORIGIN = Vector2i(-17, 2)
const QUEUE_PREVIEW_END = QUEUE_PREVIEW_ORIGIN + Vector2i(7, 12)

enum Layer {
	Background = 0,
	Board = 1,
	Piece = 2,
}

const Sprite = {
	Background = Vector2i(0,0),
	Foreground = Vector2i(1,0),
	Midground = Vector2i(2,0),
	Gem =  Vector2i(3,0)
}

#grid variables
const HEIGHT := 10
const WIDTH := 10

const MAX_GEM_WIDTH := 3
const MAX_GEM_HEIGHT := 3

# I should leanr what this is.
const TILE_ID := 0

const PLACE_PIECE_ON_BOARD_TIMER = 0.2
const DEBOUNCE_TIMER = 0.1
const LEVEL_COMPLETE_TIMER = 1
