extends TileMap

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_background_timer = $PlacePieceOnBackgroundTimer
const shapes = preload("res://scripts/shapes.gd")
const Piece = preload("res://scripts/piece.gd")
const Consts = preload("res://scripts/Consts.gd")


var current_piece: Piece
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



#game piece variables
var piece_type
var current_rotation_index : int = 0
const MAX_ROTATION_INDEX := 3
var active_piece : Array





func draw_target_gem():
	for point in target_gem:
		set_cell(Consts.BACKGROUND_LAYER, Consts.TARGET_GEM_ORIGIN + point, Consts.TILE_ID, Consts.FOREGROUND_PIECE_COLOR)


func draw_avoid_gem():
	for point in avoid_gem:
		set_cell(Consts.BACKGROUND_LAYER, Consts.AVOID_GEM_ORIGIN + point, Consts.TILE_ID, Consts.FOREGROUND_PIECE_COLOR)





func _process(delta):
	if can_process_input:
		if Input.is_action_pressed("MOVE_DOWN"):
			current_piece.move_piece(Vector2i.DOWN)
			start_debounce()
		if Input.is_action_pressed("MOVE_UP"):
			current_piece.move_piece(Vector2i.UP)
			start_debounce()
		if Input.is_action_pressed("MOVE_RIGHT"):
			current_piece.move_piece(Vector2i.RIGHT)
			start_debounce()
		if Input.is_action_pressed("MOVE_LEFT"):
			current_piece.move_piece(Vector2i.LEFT)
			start_debounce()
		if Input.is_action_pressed("ROTATE"):
			current_piece.rotate_piece()
			start_debounce()
		if Input.is_action_pressed("PLACE"):
			current_piece.draw_piece_on_background()
			start_place_piece_on_background_timer()
			start_debounce()
			var gems = find_gems()
			if(gems.size() > 0):
				level_complete(gems)

func draw_gem(gem):
	for absolute_position in gem:
		set_cell(Consts.BOARD_LAYER, absolute_position, Consts.TILE_ID, Consts.GEM_COLOR)


func level_complete(gems):
	for gem in gems:
		draw_gem(gem)
	



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
	var next_piece = queue.get_next_from_queue()
	current_piece = Piece.new(self, next_piece)
	


var visited = []
func find_gems():
	var gems = []
	visited.resize(10)
	for i in range(10):
		visited[i] = []
		visited[i].resize(10)

	#var dark_shapes = find_shapes(Consts.BACKGROUND_PIECE_COLOR)
	var light_shapes = find_shapes(Consts.FOREGROUND_PIECE_COLOR)
	
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
			var color = get_cell_atlas_coords(Consts.BOARD_LAYER, Vector2i(x,y))
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
			
		var current_color = get_cell_atlas_coords(Consts.BOARD_LAYER, Vector2i(x,y))
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
	current_piece = Piece.new(self, piece_type)


func _ready():
	queue = Queue.new(self)
	new_game()
	
	


