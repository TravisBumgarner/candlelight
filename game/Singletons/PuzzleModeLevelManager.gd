extends Node

const worlds = preload("res://Game/puzzle_mode_levels/index.json")
	
func get_worlds_metadata():
	return worlds.data
	
func get_world_metadata(world):
	worlds.data[world]

func get_level_data(world, level):
	var current_level_absolute_path = "res://Game/puzzle_mode_levels/%d/%d.cfg" % [world, level]
	var config = ConfigFile.new()
	config.load(current_level_absolute_path)

	return config
	

func get_next_world_and_level_number(world, level):    
	# Find the current world data
	var current_world = self.get_worlds_metadata().filter(func(x): return x["world_number"] == world)
	if current_world.size() == 0:
		return null  # Invalid world number
	current_world = current_world[0]
	
	# Check if there's a next level in the same world
	var levels = current_world["levels"]
	if level < levels.size():
		return {"world_number": world, "level_number": level + 1}
	
	# If no next level, check the next world
	var next_world = self.get_worlds_metadata().filter(func(x): return x["world_number"] == world + 1)
	if next_world.size() == 0:
		return null  # No more worlds available
	return {"world_number": world + 1, "level_number": 1}
