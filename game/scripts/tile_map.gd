extends TileMap

class_name TileMapGame

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_background_timer = $PlacePieceOnBackgroundTimer
const shapes = preload("res://scripts/shapes.gd")
const Piece = preload("res://scripts/piece.gd")
const consts = preload("res://scripts/consts.gd")


var current_piece_foo: Piece
var queue: Queue



# This needs rethinking
# Target gems are drawn in a space from (0,0) -> (WIDTH, HEIGHT)
# this allows for conversions later on assuming overlap.
const target_gem := [Vector2i(0, 0), Vector2i(0, 1)]
const avoid_gem := [Vector2i(0, 1), Vector2i(1, 1)]

# For debouncing layer input
const DEBOUNCE_TIMER = 0.1 # Time in seconds
var can_process_input = true

# for waiting on piece placement
const PLACE_PIECE_ON_BACKGROUND_TIMER = 0.5

#grid variables
const HEIGHT := 10
const WIDTH := 10

#game piece variables
var piece_type
var current_rotation_index : int = 0
const MAX_ROTATION_INDEX := 3
var active_piece : Array

# movement variables
const START_POSITION := Vector2i(round(HEIGHT/2), round(WIDTH/2))
var current_absolute_position : Vector2i

#tilemap variables
var tile_id := 0

# HUD variables 

 

func move_piece(direction):
	if can_move(direction):
		erase_piece()
		current_absolute_position += direction
		draw_piece(active_piece, current_absolute_position)
		start_debounce()


func draw_piece(piece, absolute_position):
	for relative_position in piece:
		var background_tile = get_cell_atlas_coords(consts.BOARD_LAYER, current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(background_tile == null):
			tile_style = consts.BACKGROUND_PIECE_COLOR
		elif(background_tile == consts.BACKGROUND_PIECE_COLOR):
			tile_style = consts.FOREGROUND_PIECE_COLOR
		elif(background_tile == consts.FOREGROUND_PIECE_COLOR):
			tile_style = consts.BACKGROUND_PIECE_COLOR
	
		set_cell(consts.PIECE_LAYER, absolute_position + relative_position, tile_id, tile_style)


func is_free(position):
	return get_cell_source_id(consts.BACKGROUND_LAYER, position) == -1


func can_move(direction):
	for point in active_piece:
		if not(is_free(point + current_absolute_position + direction)):
			return false
	return true


func can_rotate():
	var temporary_rotation_index = (current_rotation_index + 1) % shapes.SHAPES[0].size()
	for point in piece_type.rotations[temporary_rotation_index]:
		if not is_free(point + current_absolute_position):
			return false
	return true


func rotate_piece():
	if can_rotate():
		erase_piece()
		current_rotation_index = (current_rotation_index + 1) % shapes.SHAPES[0].size()
		active_piece = piece_type.rotations[current_rotation_index]
		draw_piece(active_piece, current_absolute_position)
		start_debounce()


func erase_piece():
	for point in active_piece:
		erase_cell(consts.PIECE_LAYER, current_absolute_position + point)



func draw_target_gem():
	for point in target_gem:
		set_cell(consts.BACKGROUND_LAYER, consts.TARGET_GEM_ORIGIN + point, tile_id, consts.FOREGROUND_PIECE_COLOR)


func draw_avoid_gem():
	for point in avoid_gem:
		set_cell(consts.BACKGROUND_LAYER, consts.AVOID_GEM_ORIGIN + point, tile_id, consts.FOREGROUND_PIECE_COLOR)


func draw_piece_on_background():
			#var has_background_tile = get_cell_tile_data(BOARD_LAYER, absolute_position + relative_position)
		#var tile_style = consts.FOREGROUND_PIECE_COLOR if has_background_tile else BACKGROUND_PIECE_COLOR
		#set_cell(consts.PIECE_LAYER, absolute_position + relative_position, tile_id, tile_style)
	
	for relative_position in active_piece:
		var background_tile = get_cell_atlas_coords(consts.BOARD_LAYER, current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(background_tile == null):
			tile_style = consts.BACKGROUND_PIECE_COLOR
		elif(background_tile == consts.BACKGROUND_PIECE_COLOR):
			tile_style = consts.FOREGROUND_PIECE_COLOR
		elif(background_tile == consts.FOREGROUND_PIECE_COLOR):
			tile_style = consts.BACKGROUND_PIECE_COLOR
		erase_cell(consts.PIECE_LAYER, current_absolute_position + relative_position)
		set_cell(consts.BOARD_LAYER, current_absolute_position + relative_position, tile_id, tile_style)
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
			var gems = find_gems()
			if(gems.size() > 0):
				level_complete(gems)

func draw_gem(gem):
	for absolute_position in gem:
		set_cell(consts.BOARD_LAYER, absolute_position, tile_id, consts.GEM_COLOR)


func level_complete(gems):
	for gem in gems:
		draw_gem(gem)
	

func create_piece():
	current_absolute_position = START_POSITION
	piece_type = queue.get_next_from_queue()
	active_piece = piece_type.rotations[current_rotation_index]
	queue.draw_queue(self, tile_id)
	draw_piece(active_piece, current_absolute_position)


func start_debounce():
	can_process_input = false
	debounce_timer.start(DEBOUNCE_TIMER)


func start_place_piece_on_background_timer():
	can_process_input = false
	place_piece_on_background_timer.start(PLACE_PIECE_ON_BACKGROUND_TIMER)


func is_within_bounds(position: Vector2i):
	return position.x >= 0 and position.x < HEIGHT and position.y >= 0 and position.y < WIDTH



func _on_debounce_timer_timeout():
	can_process_input = true


func _on_place_piece_on_background_timer_timeout():
	can_process_input = true
	create_piece()
	
	queue.erase_queue(self)
	queue.draw_queue(self, tile_id)

var visited = []
func find_gems():
	var gems = []
	visited.resize(10)
	for i in range(10):
		visited[i] = []
		visited[i].resize(10)

	#var dark_shapes = find_shapes(consts.BACKGROUND_PIECE_COLOR)
	var light_shapes = find_shapes(consts.FOREGROUND_PIECE_COLOR)
	
	for light_shape in light_shapes:
		if is_target_gem(light_shape):
			gems.append(light_shape)
	return gems

func absolute_to_relative_shape(shape):
	var min_x = shape.map(func(cell): return cell.x).min()
	var min_y = shape.map(func(cell): return cell.y).min()
	
	return shape.map(func(cell): return Vector2i(cell.x - min_x, cell.y - min_y))


func arrays_equal(arr1, arr2) -> bool:
	if arr1.size() != arr2.size():
		return false

	arr1.sort()
	arr2.sort()

	for i in range(arr1.size()):
		if arr1[i] != arr2[i]:
			return false
	return true


func is_target_gem(shape):
	if(shape.size() != target_gem.size()):
		return false
		
	var relative_shape = absolute_to_relative_shape(shape)
	
	var are_equal = arrays_equal(relative_shape, target_gem)
	return are_equal


func find_shapes(desired_color: Vector2i):
	var shapes = []
	for x in range(10):
		for y in range(10):
			var color = get_cell_atlas_coords(consts.BOARD_LAYER, Vector2i(x,y))
			if  color == desired_color and not visited[x][y]:
				var shape = []
				flood_fill(Vector2i(x, y), desired_color, shape)
				if shape.size() > 0:
					shapes.append(shape)
	return shapes

func flood_fill(pos, desired_color, shape):
	var stack = [pos]

	while stack.size() > 0:
		var current = stack.pop_back()
		var x = current.x
		var y = current.y

		if x < 0 or x >= 10 or y < 0 or y >= 10:
			continue
			
		var current_color = get_cell_atlas_coords(consts.BOARD_LAYER, Vector2i(x,y))
		if visited[x][y] or current_color != desired_color:
			continue

		visited[x][y] = true
		shape.append(current)

		stack.append(Vector2i(x + 1, y))
		stack.append(Vector2i(x - 1, y))
		stack.append(Vector2i(x, y + 1))
		stack.append(Vector2i(x, y - 1))


func new_game():
	draw_target_gem()
	draw_avoid_gem()
	piece_type = queue.get_next_from_queue()
	create_piece()


func _ready():
	queue = Queue.new()
	new_game()
	
	


