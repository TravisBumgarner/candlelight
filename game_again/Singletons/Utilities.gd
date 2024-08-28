extends Node

#static func is_cell_empty(tile_map, cell):
	#return tile_map.get_cell_source_id(GlobalConsts.BOARD_LAYER.PLACED_PIECES, cell) == -1

static func is_cell_border(tile_map, cell):
	return not(tile_map.get_cell_source_id(GlobalConsts.BOARD_LAYER.BORDER, cell) == -1)


#static func erase_area(tile_map, start: Vector2i, end: Vector2i, layer: int):
	#for x in range(start.x, end.x):
		#for y in range(start.y, end.y):
			#tile_map.erase_cell(layer, Vector2i(x,y))

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
static func move_cells_to_origin(cells: Array):
	var min_x = cells.map(func(cell): return cell.x).min()
	var min_y = cells.map(func(cell): return cell.y).min()
	
	return cells.map(func(cell): return Vector2i(cell.x - min_x, cell.y - min_y))

static func get_valid_neighbors(cell: Vector2i, min_vector: Vector2i, max_vector: Vector2i) -> Array:
	var all_neighbors = [
		Vector2i(cell.x + 1, cell.y),
		Vector2i(cell.x - 1, cell.y),
		Vector2i(cell.x, cell.y + 1),
		Vector2i(cell.x, cell.y - 1)
	]
	
	var valid_neighbors = all_neighbors.filter(func(v): return Utilities.is_cell_in_range(v, min_vector, max_vector))
	
	return valid_neighbors

static func is_cell_in_range(cell: Vector2i, min_vector: Vector2i, max_vector: Vector2i):
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
