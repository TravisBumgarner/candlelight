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


func get_atlas_coords_array(tile_map):
	var tile_map_array = []
	for x in range(GlobalConsts.GRID.WIDTH):
		tile_map_array.append([])
		for y in range(GlobalConsts.GRID.HEIGHT):
			var tile_id = tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_PIECES, Vector2i(x, y))
			tile_map_array[x].append(tile_id)
	
	return tile_map_array

func generate_key_from_date():
	var today_format_string = "%s-%s-%s"
	var today := Time.get_date_dict_from_system()
	var today_string = today_format_string % [today.year, today.month, today.day] 
	return hash(today_string)
