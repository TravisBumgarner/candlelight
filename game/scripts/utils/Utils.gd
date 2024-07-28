extends Node

static func erase_area(tile_map, start: Vector2i, end: Vector2i, layer: int):
	for x in range(start.x, end.x + 1):
		for y in range(start.y, end.y + 1):
			tile_map.erase_cell(layer, Vector2i(x,y))

static func is_cell_free(tile_map, cell):
	return tile_map.get_cell_source_id(Consts.Layer.Background, cell) == -1

static func is_cell_on_board(cell: Vector2i):
	if cell.x < 0 or cell.x >= Consts.GRID.WIDTH or cell.y < 0 or cell.y >= Consts.GRID.HEIGHT:
		return false
	return true

static func get_neighboring_cells_on_board(cell: Vector2i) -> Array:
	var potential_neighboring_cells = [
		Vector2i(cell.x + 1, cell.y),
		Vector2i(cell.x - 1, cell.y),
		Vector2i(cell.x, cell.y + 1),
		Vector2i(cell.x, cell.y - 1)
	]
	
	potential_neighboring_cells.filter(func(v): is_cell_on_board((v)))
	
	return potential_neighboring_cells
	
# Takes a collection of cells and moves them such that at least one point touches
# Vector2i(0, n) and one point touches Vector2i(m, 0)
static func move_cells_to_origin(cells: Array):
	var min_x = cells.map(func(cell): return cell.x).min()
	var min_y = cells.map(func(cell): return cell.y).min()
	
	return cells.map(func(cell): return Vector2i(cell.x - min_x, cell.y - min_y))



func generate_key_from_date():
	var today_format_string = "%s-%s-%s"
	var today := Time.get_date_dict_from_system()
	var today_string = today_format_string % [today.year, today.month, today.day] 
	# This might be terrible. Please forgive me lol.
	return int(str(hash(today_string)).substr(0, 6))


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


func get_atlas_coords_array(tile_map):
	var tile_map_array = []
	for x in range(Consts.GRID.WIDTH):
		tile_map_array.append([])
		for y in range(Consts.GRID.HEIGHT):
			var tile_id = tile_map.get_cell_atlas_coords(Consts.Layer.Board, Vector2i(x, y))
			tile_map_array[x].append(tile_id)
	
	return tile_map_array
