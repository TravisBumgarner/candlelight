extends Node

const worlds = preload("res://Game/puzzle_mode_levels/index.json")
	
func get_worlds_metadata():
	return worlds.data
	
func get_world_metadata(world):
	worlds.data[world]

func get_level_data(world, level):
	var current_level_absolute_path = "res://Game/puzzle_mode_levels/%%d.cfg" % [level]
	var config = ConfigFile.new()
	config.load(current_level_absolute_path)

	# Never actually used. 	
	#var next_level_absolute_path = "res://Game/puzzle_mode_levels/%d.cfg" % [level + 1]
	#config.set_value('next_level', 'exists', FileAccess.file_exists(next_level_absolute_path))
	return config
	
