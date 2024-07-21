extends Node2D
class_name GemsManager

#const Consts = preload("res://scripts/consts.gd")

const TARGET_GEM_ORIGIN = Vector2i(-9, 0)
const TARGET_GEM_END = TARGET_GEM_ORIGIN + Vector2i()

const AVOID_GEM_ORIGIN = Vector2i(-9, 8)
const AVOID_GEM_END = TARGET_GEM_ORIGIN + Vector2i()

# This needs rethinking
# Target gems are drawn in a space from (0,0) -> (WIDTH, HEIGHT)
# this allows for conversions later on assuming overlap.
const target_gem := [Vector2i(0, 0), Vector2i(0, 1)]
const avoid_gem := [Vector2i(0, 1), Vector2i(1, 1)]

var canvas

func _init(main):
	self.canvas = main


func draw_gem(gem):
	for absolute_position in gem:
		self.canvas.set_cell(Consts.Layer.Board, absolute_position, Consts.TILE_ID, Consts.Sprite.Gem)


func draw_target_gem():
	for point in target_gem:
		self.canvas.set_cell(Consts.Layer.Background, TARGET_GEM_ORIGIN + point, Consts.TILE_ID, Consts.Sprite.Foreground)


func draw_avoid_gem():
	for point in avoid_gem:
		self.canvas.set_cell(Consts.Layer.Background, AVOID_GEM_ORIGIN + point, Consts.TILE_ID, Consts.Sprite.Foreground)


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

	#var dark_shapes = find_shapes(Consts.Sprite.Background)
	var light_shapes = find_shapes(Consts.Sprite.Foreground)
	
	for light_shape in light_shapes:
		if is_target_gem(light_shape):
			gems.append(light_shape)
	return gems

func absolute_to_relative_shape(shape):
	var min_x = shape.map(func(cell): return cell.x).min()
	var min_y = shape.map(func(cell): return cell.y).min()
	
	return shape.map(func(cell): return Vector2i(cell.x - min_x, cell.y - min_y))


func arrays_equal(arr1, arr2) -> bool:
	var arr1_copy = arr1.duplicate()
	var arr2_copy = arr2.duplicate()
	
	if arr1_copy.size() != arr2_copy.size():
		return false

	arr1_copy.sort()
	arr2_copy.sort()

	for i in range(arr1.size()):
		if arr1_copy[i] != arr2_copy[i]:
			return false
	return true




func find_shapes(desired_color: Vector2i):
	var shapes = []
	for x in range(10):
		for y in range(10):
			var color = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, Vector2i(x,y))
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
			
		var current_color = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, Vector2i(x,y))
		if visited[x][y] or current_color != desired_color:
			continue

		visited[x][y] = true
		shape.append(current)

		stack.append(Vector2i(x + 1, y))
		stack.append(Vector2i(x - 1, y))
		stack.append(Vector2i(x, y + 1))
		stack.append(Vector2i(x, y - 1))
