extends TileMap

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_background_timer = $PlacePieceOnBackgroundTimer

const BACKGROUND_PIECE_COLOR = Vector2i(0,0)
const FOREGROUND_PIECE_COLOR = Vector2i(1,0)

# Assumes a 3x3 Grid for the shape rotation.
# We'll want to programatically generate these later. 
const PIECE_SIDE_LENGTH = 3

const l_0 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_90 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_180 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_270 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_preview = {
	"shape": [Vector2i(0, 0), Vector2i(1, 0), Vector2i(2,0)],
	"height": 1
}
const l := {
	"rotations": [l_0, l_90, l_180, l_270],
	"preview": l_preview
}

const r_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_90 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_180 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_preview = {
	"shape": [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)],
	"height": 2
} 
const r:= {
	"rotations":[r_0, r_90, r_180, r_270],
	"preview": r_preview
}

const SHAPES := [l, r]

# This needs rethinking
const target_gem := [Vector2i(1, 1)]
const avoid_gem := [Vector2i(0, 1), Vector2i(1, 1)]

# For debouncing layer input
const DEBOUNCE_TIMER = 0.1 # Time in seconds
var can_process_input = true

# for waiting on piece placement
const PLACE_PIECE_ON_BACKGROUND_TIMER = 0.5

#grid variables
const ROWS := 10
const COLS := 10

#game piece variables
var piece_type
var pieces_queue := []
const QUEUE_SIZE := 4
var current_rotation_index : int = 0
const MAX_ROTATION_INDEX := 3
var active_piece : Array

# movement variables
const START_POSITION := Vector2i(round(ROWS/2), round(COLS/2))
var current_absolute_position : Vector2i

#tilemap variables
var tile_id := 0

# HUD variables 

const QUEUE_PREVIEW_ORIGIN = Vector2i(-17, 2)
const QUEUE_PREVIEW_END = QUEUE_PREVIEW_ORIGIN + Vector2i(7, 12)
const TARGET_GEM_ORIGIN = Vector2i(-9, 0)
const TARGET_GEM_END = TARGET_GEM_ORIGIN + Vector2i()
const AVOID_GEM_ORIGIN = Vector2i(-9, 8)
const AVOID_GEM_END = TARGET_GEM_ORIGIN + Vector2i()

# layer variables. The below two seem to be
# based on the order of layers in the right
# sidebar.
const BACKGROUND_LAYER := 0
const BOARD_LAYER := 1
const PIECE_LAYER := 2
 

func move_piece(direction):
	if can_move(direction):
		erase_piece()
		current_absolute_position += direction
		draw_piece(active_piece, current_absolute_position)
		start_debounce()


func draw_piece(piece, absolute_position):
	for relative_position in piece:
		var background_tile = get_cell_atlas_coords(BOARD_LAYER, current_absolute_position + relative_position)
		var tile_style: Vector2i
		print(background_tile)
		
		if(background_tile == null):
			tile_style = BACKGROUND_PIECE_COLOR
		elif(background_tile == BACKGROUND_PIECE_COLOR):
			tile_style = FOREGROUND_PIECE_COLOR
		elif(background_tile == FOREGROUND_PIECE_COLOR):
			tile_style = BACKGROUND_PIECE_COLOR
	
		set_cell(PIECE_LAYER, absolute_position + relative_position, tile_id, tile_style)


func is_free(position):
	return get_cell_source_id(BACKGROUND_LAYER, position) == -1


func can_move(direction):
	for point in active_piece:
		if not(is_free(point + current_absolute_position + direction)):
			return false
	return true


func can_rotate():
	var temporary_rotation_index = (current_rotation_index + 1) % SHAPES[0].size()
	for point in piece_type.rotations[temporary_rotation_index]:
		if not is_free(point + current_absolute_position):
			return false
	return true


func rotate_piece():
	if can_rotate():
		erase_piece()
		current_rotation_index = (current_rotation_index + 1) % SHAPES[0].size()
		active_piece = piece_type.rotations[current_rotation_index]
		draw_piece(active_piece, current_absolute_position)
		start_debounce()


func erase_piece():
	for point in active_piece:
		erase_cell(PIECE_LAYER, current_absolute_position + point)


func erase_area(start: Vector2i, end: Vector2i, layer: int):
	for x in range(start.x, end.x + 1):
		for y in range(start.y, end.y + 1):
			erase_cell(layer, Vector2i(x,y))


func draw_queue():
	var y_offset = Vector2i(0, 0)
	for piece in pieces_queue:
		for point in piece.preview.shape:
			set_cell(BACKGROUND_LAYER, QUEUE_PREVIEW_ORIGIN + point + y_offset, tile_id, FOREGROUND_PIECE_COLOR) 
		y_offset += Vector2i(0, piece.preview.height + 1)


func draw_target_gem():
	for point in target_gem:
		set_cell(BACKGROUND_LAYER, TARGET_GEM_ORIGIN + point, tile_id, FOREGROUND_PIECE_COLOR)


func draw_avoid_gem():
	for point in avoid_gem:
		set_cell(BACKGROUND_LAYER, AVOID_GEM_ORIGIN + point, tile_id, FOREGROUND_PIECE_COLOR)


func draw_piece_on_background():
			#var has_background_tile = get_cell_tile_data(BOARD_LAYER, absolute_position + relative_position)
		#var tile_style = FOREGROUND_PIECE_COLOR if has_background_tile else BACKGROUND_PIECE_COLOR
		#set_cell(PIECE_LAYER, absolute_position + relative_position, tile_id, tile_style)
	
	for relative_position in active_piece:
		var background_tile = get_cell_atlas_coords(BOARD_LAYER, current_absolute_position + relative_position)
		var tile_style: Vector2i
		print(background_tile)
		
		if(background_tile == null):
			tile_style = BACKGROUND_PIECE_COLOR
		elif(background_tile == BACKGROUND_PIECE_COLOR):
			tile_style = FOREGROUND_PIECE_COLOR
		elif(background_tile == FOREGROUND_PIECE_COLOR):
			tile_style = BACKGROUND_PIECE_COLOR
		erase_cell(PIECE_LAYER, current_absolute_position + relative_position)
		set_cell(BOARD_LAYER, current_absolute_position + relative_position, tile_id, tile_style)
	start_place_piece_on_background_timer()


func _process(delta):
	if can_process_input:
		if Input.is_action_pressed("MOVE_DOWN"):
			move_piece(Vector2i.DOWN)
		if Input.is_action_pressed("MOVE_UP"):
			move_piece(Vector2i.UP)
		if Input.is_action_pressed("MOVE_RIGHT"):
			move_piece(Vector2i.RIGHT)
		if Input.is_action_pressed("MOVE_LEFT"):
			move_piece(Vector2i.LEFT)
		if Input.is_action_pressed("ROTATE"):
			rotate_piece()	
		if Input.is_action_pressed("PLACE"):
			draw_piece_on_background()


func create_piece():
	current_absolute_position = START_POSITION
	piece_type = get_next_from_queue()
	active_piece = piece_type.rotations[current_rotation_index]
	draw_queue()
	draw_piece(active_piece, current_absolute_position)


func start_debounce():
	can_process_input = false
	debounce_timer.start(DEBOUNCE_TIMER)


func start_place_piece_on_background_timer():
	can_process_input = false
	place_piece_on_background_timer.start(PLACE_PIECE_ON_BACKGROUND_TIMER)


func _on_debounce_timer_timeout():
	can_process_input = true


func _on_place_piece_on_background_timer_timeout():
	can_process_input = true
	create_piece()
	erase_area(QUEUE_PREVIEW_ORIGIN, QUEUE_PREVIEW_END, BACKGROUND_LAYER)
	draw_queue()


func fill_queue():
	while pieces_queue.size() < QUEUE_SIZE:
		pieces_queue.append(SHAPES.pick_random())


func get_next_from_queue():
	var next_piece = pieces_queue.pop_front()
	fill_queue()
	return next_piece


func new_game():
	fill_queue()
	draw_target_gem()
	draw_avoid_gem()
	piece_type = get_next_from_queue()
	create_piece()


func _ready():
	new_game()


