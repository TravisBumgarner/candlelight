extends TileMap

const DARK_GRAY = Vector2i(0,0)
const LIGHT_GRAY = Vector2i(1,0)

# Assumes a 3x3 Grid for the shape rotation.
# We'll want to programatically generate these later. 
const l_0 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_90 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_180 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_270 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l := [l_0, l_90, l_180, l_270]

const r_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_90 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_180 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r := [r_0, r_90, r_180, r_270]

const SHAPES := [l, r]

#grid variables
const ROWS := 9
const COLS := 9

#game piece variables
var piece_type
var next_piece_type
var current_rotation_index : int = 0
const MAX_ROTATION_INDEX := 3
var active_piece : Array

# movement variables
const START_POSITION := Vector2i(round(ROWS/2), round(COLS/2))
var current_position : Vector2i

#tilemap variables
var tile_id := 0
var next_piece_atlas : Vector2i

# layer variables. The below two seem to be
# based on the order of layers in the right
# sidebar.
var board_layer : int = 0
var active_layer : int = 1
 
func move_piece(direction):
	if can_move(direction):
		clear_piece()
		current_position += direction
		draw_piece(active_piece, current_position)

func draw_piece(piece, position):
	for i in piece:
		set_cell(active_layer, position + i, tile_id, LIGHT_GRAY)

func is_free(position):
	return get_cell_source_id(board_layer, position) == -1

func can_move(direction):
	var can_move = true
	for i in active_piece:
		if not(is_free(i + current_position + direction)):
			can_move = false
	return can_move
	
func can_rotate():
	var can_rotate = true
	var temporary_rotation_index = (current_rotation_index + 1) % SHAPES[0].size()
	for i in piece_type[temporary_rotation_index]:
		if not is_free(i + current_position):
			can_rotate = false
	return can_rotate
	

func rotate_piece():
	if can_rotate():
		clear_piece()
		current_rotation_index = (current_rotation_index + 1) % SHAPES[0].size()
		active_piece = piece_type[current_rotation_index]
		draw_piece(active_piece, current_position)

func clear_piece():
	for i in active_piece:
		erase_cell(active_layer, current_position + i)
	
func _process(delta):
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

func pick_piece():
# This is where the random piece generation will go.
	return SHAPES.pick_random()

func create_piece():
	current_position = START_POSITION
	active_piece = piece_type[current_rotation_index]
	print('active', active_piece)
	draw_piece(active_piece, current_position)
	

	

func new_game():
	piece_type = pick_piece()
	print(piece_type)
	create_piece()

func _ready():
	new_game()
