extends Node

const levels = preload("res://Game/puzzle_mode_levels/index.json")



# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
	
func get_worlds_metadata():
	return levels.data

func get_level_data(level):
	var current_level_absolute_path = "res://Game/puzzle_mode_levels/%d.cfg" % [level]
	var config = ConfigFile.new()
	config.load(current_level_absolute_path)
	
	var next_level_absolute_path = "res://Game/puzzle_mode_levels/%d.cfg" % [level + 1]
	config.set_value('next_level', 'exists', FileAccess.file_exists(next_level_absolute_path))
	
	return config
	
