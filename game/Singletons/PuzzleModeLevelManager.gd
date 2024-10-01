extends Node

const levels = preload("res://Game/puzzle_mode_levels/index.json")

func get_levels_metadata():
	return levels.data

func get_level_data(level):
	var absolute_path = "res://Game/puzzle_mode_levels/%d.cfg" % [level]
	var config = ConfigFile.new()
	config.load(absolute_path)
	
	return config
	
