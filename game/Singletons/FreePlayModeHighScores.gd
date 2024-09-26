extends Node

var config_file_path = "user://free_play_mode_high_scores.cfg"

var high_scores = []

func _ready():
	load_high_scores()

func load_high_scores():
	var config = ConfigFile.new()
	var err = config.load(config_file_path)
	
	if err != OK:
		print("Could not load high scores, initializing new list.")
		high_scores = []
		return
	
	high_scores = config.get_value("HighScores", "scores", [])
	sort_scores()

func save_high_scores():
	var config = ConfigFile.new()
	
	config.set_value("HighScores", "scores", high_scores)
	
	var err = config.save(config_file_path)
	if err == OK:
		print("High scores saved successfully.")
	else:
		print("Error saving high scores.")

func add_high_score(alchemizations, level):
	var found = false
	for score in high_scores:
		if score.alchemizations == alchemizations:
			found = true
			break
	
	if not found:
		high_scores.append({"alchemizations": alchemizations, "level": level})
	
	sort_scores()
	save_high_scores()

func sort_scores():
	high_scores.sort_custom(_compare_scores)

func get_high_scores():
	return high_scores

func _compare_scores(a, b):
	if a["level"] == b["level"]:
		return a["alchemizations"] < b["alchemizations"] 
	return b["level"] < a["level"]
