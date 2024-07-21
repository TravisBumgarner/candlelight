extends Node

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
	Gem =  Vector2i(3,0)
}


#grid variables
const HEIGHT := 10
const WIDTH := 10

# I should leanr what this is.
const TILE_ID := 0

const PLACE_PIECE_ON_BACKGROUND_TIMER = 0.2
const DEBOUNCE_TIMER = 0.1
