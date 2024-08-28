extends Node
class_name History

# Stores entire board along with the last piece. 

var history: Array = []

func pop():
	return history.pop_back()

func append(tile_map, player):
	var record = {
		atlas_coords_array = Utilities.get_atlas_coords_array(tile_map),
		player = player
	}
	history.append(record)
	
func size():
	return history.size()
	
func empty():
	history.clear()
