extends Node2D
class_name GemsManager

var target_gem: Array
var board_tile_map: TileMap
var target_gem_tile_map: TileMap
var queue_tile_map: TileMap

func _init(board_tile_map: TileMap, target_gem_tile_map: TileMap, queue_tile_map: TileMap):
	self.board_tile_map = board_tile_map
	self.target_gem_tile_map = target_gem_tile_map
	self.queue_tile_map = queue_tile_map
#
func puzzle_mode_level_to_gem_size(level: int) -> int:
	if level < 2:
		return 1
	elif level < 4:
		return 2
	elif level < 7:
		return 3
	elif level < 10:
		return 4
	elif level < 15:
		return 5
	elif level < 21:
		return 6
	elif level < 27:
		return 7
	elif level < 34:
		return 8
	elif level < 39:
		return 9
	elif level < 44:
		return 10
	elif level < 50:
		return 11
	elif level < 56:
		return 12
	elif level < 61:
		return 13
	elif level < 66:
		return 14
	else:
		return 15


#func daily_mode_generate_gem(game_key: int):
	#var RNG = RandomNumberGenerator.new()
	#RNG.seed = game_key
	#var size = RNG.randi_range(8, 12)
#
	#var current_point = Vector2i(RNG.randi_range(0, GlobalConsts.MAX_GEM_SIZE), RNG.randi_range(0, GlobalConsts.MAX_GEM_SIZE))
	#var points = [current_point]
	#
	#var potential_neighbors = Utils.get_valid_neighbors(current_point, Vector2i(0,0), Vector2i(GlobalConsts.MAX_GEM_SIZE, GlobalConsts.MAX_GEM_SIZE))
#
	#while points.size() < size:
		#var new_neighbor = null
		#Utils.shuffle_rng_array(RNG, potential_neighbors)
		#
		#var potential_neighbor = potential_neighbors.pop_front()
		#while potential_neighbors.size() > 0:
			#if potential_neighbor not in points:
				#new_neighbor = potential_neighbor
				#break
			#potential_neighbor = potential_neighbors.pop_front()
		#
		## It's possible to end up in an infinite loop should the shape spiral in on itself.
		## I believe This is only possible for gem sizes >= 9 cells. For now, we'll just
		## break early to prevent the infinite loop.
		#if new_neighbor == null:
			#break
		#
		#potential_neighbors = Utils.get_valid_neighbors(new_neighbor, Vector2i(0,0), Vector2i(GlobalConsts.MAX_GEM_SIZE, GlobalConsts.MAX_GEM_SIZE))
		#points.append(new_neighbor)
	#self.target_gem = Utils.move_cells_to_origin(points)
#
#
func puzzle_mode_generate_gem(size: int):
	# It's possible that due to the algorithm below, the generation can exit prematurely. So we start the gem in the middle for best luck of being
	# the desired size. 
	var current_point = Vector2i(round(GlobalConsts.MAX_GEM_SIZE / 2), round(GlobalConsts.MAX_GEM_SIZE / 2))
	var points = [current_point]
	
	var potential_neighbors = Utilities.get_valid_neighbors(current_point, Vector2i(0,0), Vector2i(GlobalConsts.MAX_GEM_SIZE, GlobalConsts.MAX_GEM_SIZE))
	while points.size() < size:
		var new_neighbor = null
		potential_neighbors.shuffle()
		
		var potential_neighbor = potential_neighbors.pop_front()
		while potential_neighbors.size() > 0:
			if potential_neighbor not in points:
				new_neighbor = potential_neighbor
				break
			potential_neighbor = potential_neighbors.pop_front()
		
		# It's possible to end up in an infinite loop should the shape spiral in on itself.
		# I believe This is only possible for gem sizes >= 9 cells. For now, we'll just
		# break early to prevent the infinite loop.
		if new_neighbor == null:
			break
		
		potential_neighbors = Utilities.get_valid_neighbors(new_neighbor, Vector2i(0,0), Vector2i(GlobalConsts.MAX_GEM_SIZE, GlobalConsts.MAX_GEM_SIZE))
		points.append(new_neighbor)
	self.target_gem = Utilities.move_cells_to_origin(points)


func erase_target_gem():
	target_gem_tile_map.clear_layer(GlobalConsts.TARGET_GEM_LAYER.GEM)


func draw_gem_on_board(gem):
	for absolute_position in gem:
		self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.PLACED_PIECES, absolute_position, GlobalConsts.GEMS_TILE_ID, GlobalConsts.SPRITE.GEM_BLUE)


func puzzle_mode_set_target_gem(level: int):
	self.erase_target_gem()
	var size = self.puzzle_mode_level_to_gem_size(level)
	self.puzzle_mode_generate_gem(size)
	self.draw_target_gem()
#

#func daily_mode_set_target_gem(game_key):
	#self.erase_target_gem()
	#self.daily_mode_generate_gem(game_key)
	#self.draw_target_gem()

func draw_target_gem():
	for point in target_gem:
		self.target_gem_tile_map.set_cell(GlobalConsts.TARGET_GEM_LAYER.GEM, point, GlobalConsts.GEMS_TILE_ID, GlobalConsts.SPRITE.GEM_BLUE)


func is_target_gem(shape):
	if(shape.size() != target_gem.size()):
		return false
		
	var relative_shape = Utilities.move_cells_to_origin(shape)
	
	var are_equal = arrays_equal(relative_shape, target_gem)
	return are_equal


var visited = []
func find_gems():
	var gems = []
	visited.resize(GlobalConsts.GRID.WIDTH)
	for i in range(GlobalConsts.GRID.WIDTH):
		visited[i] = []
		visited[i].resize(GlobalConsts.GRID.HEIGHT)

	var light_shapes = find_shapes(GlobalConsts.SPRITE.LIGHT_INACTIVE)
	print(light_shapes)
	for light_shape in light_shapes:
		if is_target_gem(light_shape):
			gems.append(light_shape)
	return gems


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
	print('find_shapes')
	var shapes = []
	for x in range(GlobalConsts.GRID.WIDTH):
		for y in range(GlobalConsts.GRID.HEIGHT):
			var color = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_PIECES, Vector2i(x,y))
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

		var current_color = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_PIECES, Vector2i(x,y))
		if visited[x][y] or current_color != desired_color:
			continue

		visited[x][y] = true
		shape.append(current)

		var potential_neighbors = Utilities.get_valid_neighbors(Vector2i(x,y), Vector2i(0,0), Vector2i(GlobalConsts.GRID.WIDTH, GlobalConsts.GRID.HEIGHT))
		stack.append_array(potential_neighbors)
