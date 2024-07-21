extends Node2D
class_name GemsManager

const Consts = preload("res://scripts/consts.gd")

# This needs rethinking
# Target gems are drawn in a space from (0,0) -> (WIDTH, HEIGHT)
# this allows for conversions later on assuming overlap.
const target_gem := [Vector2i(0, 0), Vector2i(0, 1)]
const avoid_gem := [Vector2i(0, 1), Vector2i(1, 1)]

var canvas

func _init(canvas):
	self.canvas = canvas


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass



func draw_gem(gem):
	for absolute_position in gem:
		self.canvas.set_cell(Consts.BOARD_LAYER, absolute_position, Consts.TILE_ID, Consts.GEM_COLOR)


func draw_target_gem():
	for point in target_gem:
		self.canvas.set_cell(Consts.BACKGROUND_LAYER, Consts.TARGET_GEM_ORIGIN + point, Consts.TILE_ID, Consts.FOREGROUND_PIECE_COLOR)


func draw_avoid_gem():
	for point in avoid_gem:
		self.canvas.set_cell(Consts.BACKGROUND_LAYER, Consts.AVOID_GEM_ORIGIN + point, Consts.TILE_ID, Consts.FOREGROUND_PIECE_COLOR)


func is_target_gem(shape):
	if(shape.size() != target_gem.size()):
		return false
		
	var relative_shape = absolute_to_relative_shape(shape)
	
	var are_equal = arrays_equal(relative_shape, target_gem)
	return are_equal



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




func find_shapes(desired_color: Vector2i):
	var shapes = []
	for x in range(10):
		for y in range(10):
			var color = self.canvas.get_cell_atlas_coords(Consts.BOARD_LAYER, Vector2i(x,y))
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
			
		var current_color = self.canvas.get_cell_atlas_coords(Consts.BOARD_LAYER, Vector2i(x,y))
		if visited[x][y] or current_color != desired_color:
			continue

		visited[x][y] = true
		shape.append(current)

		stack.append(Vector2i(x + 1, y))
		stack.append(Vector2i(x - 1, y))
		stack.append(Vector2i(x, y + 1))
		stack.append(Vector2i(x, y - 1))
