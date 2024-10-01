#extends Node
#
#var absolute_file_path = "user://game_saves/%s/%s.save" %[GlobalConsts.GAME_MODE.Daily, GlobalState.save_slot]
#
#var high_scores = {}
#
#func _ready():
	#load_high_scores()
#
#func load_high_scores():
	#var config = ConfigFile.new()
	#var err = config.load(absolute_file_path)
	#
	#if err != OK:
		#print("Could not load high scores, initializing new dict.")
		#high_scores = {}
		#return
	#
	#high_scores = config.get_value("HighScores", "scores", {})
#
#func save_high_scores():
	#var config = ConfigFile.new()
	#config.set_value("HighScores", "scores", high_scores)
	#
	#var err = config.save(absolute_file_path)
	#if err == OK:
		#print("High scores saved successfully.")
	#else:
		#print("Error saving high scores.")
#
#func add_high_score(alchemizations):
	#var today = Utilities.get_daily_puzzle_date()
	#
	#if today not in high_scores:
		#high_scores[today] = []
#
	#high_scores[today].append({
		#"save_slot": GlobalState.save_slot,
		#"alchemizations": alchemizations,
		#})
	#high_scores[today].sort_custom(_compare_scores)
	#
	#save_high_scores()
#
#func get_high_scores():
	#return high_scores
	#
#func get_high_score_by_date(target_date):
	#var min_alchemizations = INF 
	#
	#if target_date in self.high_scores:	
		#var target_date_high_scores = self.high_scores[target_date]
		#if target_date_high_scores:
			#min_alchemizations = target_date_high_scores[0]['alchemizations']
	#return min_alchemizations
#
#func _compare_scores(a, b):
	#return a["alchemizations"] < b["alchemizations"] 
