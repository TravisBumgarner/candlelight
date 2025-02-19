extends BaseGame
class_name PuzzleGame

var is_game_over: bool = false

var best_score = -1

func _init(args):                
	super(args)

func new_game():
	self.disable_player_interaction = false
	self.level_complete_controls_center_container.hide()
	erase_board()
	self.alchemizations = 0

	var level_config = PuzzleModeLevelManager.get_level_data(world_number, level_number)
	var game_saves_path = "user://game_saves/%s" % [GlobalConsts.GAME_MODE.Puzzle]
	var absolute_file_path = "%s/%s.save" % [game_saves_path, GlobalState.save_slot]	
	var save_config = ConfigFile.new()
	save_config.load(absolute_file_path)
	var puzzle_id = Utilities.create_puzzle_id(world_number, level_number)
	best_score = save_config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.PuzzleLevelScores, puzzle_id, -1)

	var visible_queue_size = 3
	var game_key = null
	var should_fill_queue = false
	queue = Queue.new(queue_control, game_key, visible_queue_size, should_fill_queue)

	queue.load(level_config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_LEVEL_METADATA.QUEUE))
	gemsManager = GemsManager.new(board_tile_map, target_gem_control, queue_control)
	var target_gem = level_config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_LEVEL_METADATA.TARGET_GEM)
	gemsManager.set_gem(target_gem)

	update_game_display()
	
	self.history = History.new()

	player = Player.new(board_tile_map, queue.next())

func load_game():
	# Save states are not quite consistant across game modes. Will maybe need to think through this more.
	self.new_game()

func level_complete(gems):
	disable_player_interaction = true
	var next_level = PuzzleModeLevelManager.get_next_world_and_level_number(world_number, level_number)
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	
	upsert_game_save(next_level)
	if next_level != null:
		SoundManager.play("one_gem")
		level_complete_timer.start(1)
	else:
		SoundManager.play("two_gems")
		game_complete_timer.start(1)

func upsert_game_save(next_level):
	var config = ConfigFile.new()
	config.load('user://game_saves/%s/%s.save' % [GlobalConsts.GAME_MODE.Puzzle, GlobalState.save_slot])
	
	if next_level != null:
		var current_max = {
			"level_number": config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_LEVEL_NUMBER, 1),
			"world_number": config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_WORLD_NUMBER, 1)
		}

		var should_make_next_level_available = Utilities.is_less_than_world_level(current_max, next_level)
		
		if (should_make_next_level_available):
			config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_LEVEL_NUMBER, next_level['level_number'])
			config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_WORLD_NUMBER, next_level['world_number'])
	 
	var new_high_score = alchemizations < best_score or best_score == -1
	if new_high_score:
		var puzzle_id = Utilities.create_puzzle_id(world_number, level_number)
		config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.PuzzleLevelScores, puzzle_id, alchemizations)	
	
	Utilities.write_game_save(GlobalConsts.GAME_MODE.Puzzle, GlobalState.save_slot, config)
	
func _on_level_complete_timer_timeout():
	self.level_complete_controls_center_container.show()
	self.level_complete_controls_center_container.find_child('NextLevelButton').show()
	self.level_complete_controls_center_container.find_child('NextLevelButton').grab_focus()

func _on_game_over_timer_timeout():
	is_game_over = true
	self.level_complete_controls_center_container.show()
	self.level_complete_controls_center_container.find_child('NextLevelButton').hide()
	self.level_complete_controls_center_container.find_child('RestartButton').grab_focus()

func _on_game_complete_timer_timeout():
	is_game_over = true
	self.game_complete_controls_center_container.show()
	self.game_complete_controls_center_container.find_child('MainMenuButton').grab_focus()

func game_over():
	self.disable_player_interaction = true
	SoundManager.play("nonmovement")
	SoundManager.play("nonmovement")
	game_over_timer.start(1)


func update_game_display():
	var text = "[center]"
	text += "Level " + str(world_number) + "_" + str(level_number) + '\n'
	text += "Score: " + str(alchemizations)  + '\n'
		
	if best_score != -1:
		text += "Best: " + str(best_score)

	self.game_details_value.text = text
	
