extends Node

#static func is_cell_empty(tile_map, cell):
	#return tile_map.get_cell_source_id(GlobalConsts.BOARD_LAYER.PLACED_PIECES, cell) == -1

static func is_cell_border(tile_map, cell):
	return not(tile_map.get_cell_source_id(GlobalConsts.BOARD_LAYER.BORDER, cell) == -1)


static func erase_area(tile_map, start: Vector2i, end: Vector2i, layer: int):
	for x in range(start.x, end.x):
		for y in range(start.y, end.y):
			tile_map.erase_cell(layer, Vector2i(x,y))

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


