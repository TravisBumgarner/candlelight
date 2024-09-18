extends BaseGame
class_name DailyGame

var today_best_score = ''

func _init(args):                
	super(args)

func level_complete(gems):
	disable_player_interaction = true
	SoundManager.play("two_gems")	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	DailyModeHighScores.add_high_score(alchemizations)
	level_complete_timer.start(1)


func _on_level_complete_timer_timeout():
	pass

func new_game():
	disable_player_interaction = false
	var key = Utilities.generate_key_from_date()
	
	today_best_score = DailyModeHighScores.get_high_score_by_date(Utilities.get_daily_puzzle_date())
	alchemizations = 0
	
	update_game_display()
	erase_board()
	history = History.new()
	var visible_queue_size = 3
	queue = Queue.new(queue_tile_map, key, visible_queue_size)
	queue.fill_queue()
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.daily_mode_set_target_gem(key)

func update_game_display():
	var text = "[center]"
	text += str(alchemizations) + " Alchemization"
	if alchemizations != 1:
		text += "s"
	text += '\n'
		
	if today_best_score != INF:
		text += "\nBest:\n"
		text += str(today_best_score) + " Alchemization"
		if today_best_score != 1:
			text += "s\n"
	
	game_details_value.text = text
	

