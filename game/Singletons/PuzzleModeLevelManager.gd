extends Node

const worlds = preload("res://assets/puzzle_mode_levels/index.json")
	
func get_worlds_metadata():
	return worlds.data
	
func get_level_data(world_number, level_number):
	var level_metadata = self.get_level_metadata(world_number, level_number)
	print('level metadat', level_metadata)
	var current_level_absolute_path = "res://assets/puzzle_mode_levels/%s" % [level_metadata['file_name']]
	var config = ConfigFile.new()
	config.load(current_level_absolute_path)

	return config

func get_level_metadata(world_number, level_number):
	var current_world = self.get_worlds_metadata().values().filter(func(x): return x["world_number"] == world_number)[0]
	print('current worold', current_world)
	# 1 indexing for level_number, 0 indexing for array.
	var level_metadata = current_world['levels'][level_number - 1]
	
	return level_metadata


func get_next_world_and_level_number(world_number, level_number):    
	# Find the current world data
	var current_world = self.get_worlds_metadata().values().filter(func(x): return x["world_number"] == world_number)
	if current_world.size() == 0:
		return null  # Invalid world number
	current_world = current_world[0]
	
	# Check if there's a next level in the same world
	var levels = current_world["levels"]
	if level_number < levels.size():
		return {"world_number": world_number, "level_number": level_number + 1}
	
	# If no next level, check the next world
	var next_world = self.get_worlds_metadata().values().filter(func(x): return x["world_number"] == world_number + 1)
	if next_world.size() == 0:
		return null  # No more worlds available
	return {"world_number": world_number + 1, "level_number": 1}
