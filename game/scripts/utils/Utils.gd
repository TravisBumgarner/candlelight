extends TileMap


static func erase_area(canvas, start: Vector2i, end: Vector2i, layer: int):
	for x in range(start.x, end.x + 1):
		for y in range(start.y, end.y + 1):
			canvas.erase_cell(layer, Vector2i(x,y))

static func is_cell_free(canvas, cell):
	return canvas.get_cell_source_id(Consts.Layer.Background, cell) == -1

static func is_cell_on_board(cell: Vector2i):
	if cell.x < 0 or cell.x >= Consts.WIDTH or cell.y < 0 or cell.y >= Consts.HEIGHT:
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
