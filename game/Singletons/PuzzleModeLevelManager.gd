extends Node

const levels = preload("res://Game/puzzle_mode_levels/index.json")



# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process():
	#pass
	
func get_levels_metadata():
	# Data of type {file: string, level: number}[]
	return levels.data

func get_level_data(level):
	var absolute_path = "res://Game/puzzle_mode_levels/%d.cfg" % [level]
	var config = ConfigFile.new()
	config.load(absolute_path)
	
	return config
	
