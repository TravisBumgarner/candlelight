extends TileMapGame

class_name Utils

func erase_area(canvas, start: Vector2i, end: Vector2i, layer: int):
	for x in range(start.x, end.x + 1):
		for y in range(start.y, end.y + 1):
			canvas.erase_cell(layer, Vector2i(x,y))
