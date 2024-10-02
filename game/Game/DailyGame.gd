extends BaseGame
class_name DailyGame

var today_best_score = -1

func _init(args):                
	super(args)

func level_complete(gems):
	disable_player_interaction = true
	SoundManager.play("two_gems")	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	upsert_scores()

	level_complete_timer.start(1)

func upsert_scores():
	var config = ConfigFile.new()
	config.load('user://game_saves/%s/%s.save' % [GlobalConsts.GAME_MODE.Daily, GlobalState.save_slot])
	var today = Utilities.get_daily_puzzle_date()
	var best_scores = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.DAILY_SAVE_METADATA.BEST_SCORES, {})
	
	var not_scored_today = today not in best_scores
	var beat_high_score_today = today in best_scores and alchemizations < best_scores[today] 
	if not_scored_today or beat_high_score_today:
		best_scores[today] = alchemizations
	
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.DAILY_SAVE_METADATA.BEST_SCORES, best_scores)
	Utilities.write_game_save(GlobalConsts.GAME_MODE.Daily, GlobalState.save_slot, config)

func _on_level_complete_timer_timeout():
	pass

func new_game():
	disable_player_interaction = false
	var game_key = Utilities.generate_key_from_date()
	
	var game_saves_path = "user://game_saves/%s" % [GlobalConsts.GAME_MODE.Daily]
	var absolute_file_path = "%s/%s.save" % [game_saves_path, GlobalState.save_slot]
		
	var config = ConfigFile.new()
	config.load(absolute_file_path)
	var best_scores = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.DAILY_SAVE_METADATA.BEST_SCORES, {})
	var today = Utilities.get_daily_puzzle_date()
	
	if today in best_scores:
		today_best_score = best_scores[today]
	
	alchemizations = 0
	
	update_game_display()
	erase_board()
	history = History.new()
	var visible_queue_size = 3
	queue = Queue.new(queue_control, game_key, visible_queue_size)
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_control, queue_control)
	gemsManager.daily_mode_set_target_gem(game_key)

func update_game_display():
	var text = "[center]"
	text += str(alchemizations) + " Alchemization"
	if alchemizations != 1:
		text += "s"
	text += '\n'
		
	if today_best_score != -1:
		text += "\nBest:\n"
		text += str(today_best_score) + " Alchemization"
		if today_best_score != 1:
			text += "s\n"
	
	game_details_value.text = text
	
func load_game():
	# Save states are not quite consistant across game modes. Will maybe need to think through this more.
	self.new_game()

