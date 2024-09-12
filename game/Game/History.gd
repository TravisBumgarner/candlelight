extends Node
class_name History

# Stores entire board along with the last piece. 

var history: Array = []

func pop():
	return history.pop_back()

func append(placed_shapes_tile_map, shape):
	var record = {
		placed_shapes = Utilities.tile_map_to_array(placed_shapes_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES),
		shape = shape
	}
	history.append(record)
	
func size():
	return history.size()
	
func empty():
	history.clear()

func load(data: Array):
	self.empty()
	self.history = data

func get_history():
	return self.history
