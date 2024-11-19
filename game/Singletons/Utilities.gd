extends Node

func is_cell_border(tile_map, cell):
	return not(tile_map.get_cell_source_id(GlobalConsts.BOARD_LAYER.BORDER, cell) == -1)

func is_cell_blocker(tile_map, cell):
	return not(tile_map.get_cell_source_id(GlobalConsts.BOARD_LAYER.BLOCKERS, cell) == -1)


func swap(i : int, j : int, a : Array) -> Array:
	var t = a[i]
	a[i] = a[j]
	a[j] = t
	return a

func shuffle_rng_array(rng: RandomNumberGenerator, arr: Array):
	for i in range(arr.size()):
		var j = rng.randi_range(0, arr.size() - 1)
		swap(i, j, arr)
		
		
func rng_array_item(rng: RandomNumberGenerator, arr: Array):
	return arr[rng.randi() % arr.size()]

# Takes a collection of cells and moves them such that at least one point touches
# Vector2i(0, n) and one point touches Vector2i(m, 0)
func move_cells_to_origin(cells: Array):
	var min_x = cells.map(func(cell): return cell.x).min()
	var min_y = cells.map(func(cell): return cell.y).min()
	
	return cells.map(func(cell): return Vector2i(cell.x - min_x, cell.y - min_y))

func get_valid_neighbors(cell: Vector2i, min_vector: Vector2i, max_vector: Vector2i) -> Array:
	var all_neighbors = [
		Vector2i(cell.x + 1, cell.y),
		Vector2i(cell.x - 1, cell.y),
		Vector2i(cell.x, cell.y + 1),
		Vector2i(cell.x, cell.y - 1)
	]
	
	var valid_neighbors = all_neighbors.filter(func(v): return Utilities.is_cell_in_range(v, min_vector, max_vector))
	
	return valid_neighbors

func is_cell_in_range(cell: Vector2i, min_vector: Vector2i, max_vector: Vector2i):
	if cell.x < min_vector.x  or cell.x > max_vector.x or cell.y < min_vector.y or cell.y > max_vector.y:
		return false
	return true

 # Takes a tile map, used for the game, and converts it for history or game saves
func tile_map_to_array(tile_map, level):
	var tile_map_array = []
	for x in range(GlobalConsts.GRID.WIDTH):
		tile_map_array.append([])
		for y in range(GlobalConsts.GRID.HEIGHT):
			var tile_id = tile_map.get_cell_atlas_coords(level, Vector2i(x, y))
			tile_map_array[x].append(tile_id)
	
	return tile_map_array
	
# Takes an array, used for history or game saves, and applies it to the board game tile map of placed pieces.	
func array_to_tile_map(board_tile_map, layer, array):
	board_tile_map.clear_layer(layer)
	
	for x in range(GlobalConsts.GRID.WIDTH):
		for y in range(GlobalConsts.GRID.HEIGHT):
			var tile_style = array[x][y]
			board_tile_map.set_cell(layer, Vector2i(x,y), GlobalConsts.GEMS_TILE_ID, tile_style)

func generate_key_from_date():
	var today_format_string = "%s-%s-%s"
	var today := Time.get_date_dict_from_system()
	var today_string = today_format_string % [today.year, today.month, today.day] 
	return hash(today_string)
	
func get_daily_puzzle_date() -> String:
	return Time.get_date_string_from_system()


func create_or_load_game_save(game_mode: String, save_slot: String):
	var config = ConfigFile.new()
	var game_mode_path = "user://game_saves/%s" % [game_mode]
	DirAccess.make_dir_recursive_absolute(game_mode_path)
	var game_save_path = "%s/%s.save" % [game_mode_path, save_slot]
	return config.load(game_save_path)
	
func write_game_save(game_mode: String, save_slot: String, config: ConfigFile):
	var game_mode_path = "user://game_saves/%s" % [game_mode]
	DirAccess.make_dir_recursive_absolute(game_mode_path)
	var game_save_path = "%s/%s.save" % [game_mode_path, save_slot]
	config.save(game_save_path)

func load_json(file_path: String) -> Dictionary:
	var file = FileAccess.open(file_path, FileAccess.READ)
	if file:
		var json_string = file.get_as_text()
		file.close()
		
		# Parse the JSON
		var json = JSON.new()
		json.parse(json_string)
		return json.get_data()
	
	else:
		print("Error opening file: ", file_path)
		return {}

func remove_all_children(node):
	for i in range(node.get_child_count()):
		var child = node.get_child(0)
		node.remove_child(child)


func is_less_than_world_level(pair_a: Dictionary, pair_b: Dictionary) -> bool:
	
	# Compare by world number first
	if pair_a["world_number"] < pair_b["world_number"]:
		return true
	elif pair_a["world_number"] > pair_b["world_number"]:
		return false
	
	# If world numbers are the same, compare by level number
	return pair_a["level_number"] < pair_b["level_number"]
