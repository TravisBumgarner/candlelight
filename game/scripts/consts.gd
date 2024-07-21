extends Node

const QUEUE_PREVIEW_ORIGIN = Vector2i(-17, 2)
const QUEUE_PREVIEW_END = QUEUE_PREVIEW_ORIGIN + Vector2i(7, 12)

# layer variables. The below two seem to be
# based on the order of layers in the right
# sidebar.
const BACKGROUND_LAYER := 0
const BOARD_LAYER := 1
const PIECE_LAYER := 2


const BACKGROUND_PIECE_COLOR = Vector2i(0,0)
const FOREGROUND_PIECE_COLOR = Vector2i(1,0)
const GEM_COLOR = Vector2i(3,0)


const TARGET_GEM_ORIGIN = Vector2i(-9, 0)
const TARGET_GEM_END = TARGET_GEM_ORIGIN + Vector2i()
const AVOID_GEM_ORIGIN = Vector2i(-9, 8)
const AVOID_GEM_END = TARGET_GEM_ORIGIN + Vector2i()
