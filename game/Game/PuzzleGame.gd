extends BaseGame
class_name PuzzleGame

var is_game_over: bool = false

var best_score = -1

func _init(args):                
	super(args)

func new_game():
	self.disable_player_interaction = false
	self.level_complete_controls_h_box_container.hide()
	erase_board()
	self.alchemizations = 0
	
	print('doot doot', GlobalState.puzzle_mode_level)
	var level_config = PuzzleModeLevelManager.get_level_data(world_number, level_number)
	
	var game_saves_path = "user://game_saves/%s" % [GlobalConsts.GAME_MODE.Puzzle]
	var absolute_file_path = "%s/%s.save" % [game_saves_path, GlobalState.save_slot]	
	var save_config = ConfigFile.new()
	save_config.load(absolute_file_path)
	best_score = save_config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.PuzzleLevelScores, 'level%s' % [level_number], -1)

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
	upsert_game_save()
	disable_player_interaction = true
	
	SoundManager.play("one_gem")

	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(1)
	

func upsert_game_save():
	var config = ConfigFile.new()
	config.load('user://game_saves/%s/%s.save' % [GlobalConsts.GAME_MODE.Puzzle, GlobalState.save_slot])
	# TODO RESOLVE
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_WORLD_NUMBER, 1)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_LEVEL_NUMBER, level_number)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.PuzzleLevelScores, 'level%d' % [level_number], alchemizations)	
	Utilities.write_game_save(GlobalConsts.GAME_MODE.Puzzle, GlobalState.save_slot, config)

func _on_action_pressed(action):
	if action == 'undo' and is_game_over:
		is_game_over = false
		self.level_complete_controls_h_box_container.hide()
		self.level_complete_controls_h_box_container.find_child('NextLevelButton').disabled = false
	
	super(action)
	

func _on_level_complete_timer_timeout():
	self.level_complete_controls_h_box_container.show()
	if level_number == 5:
		self.level_complete_controls_h_box_container.find_child('NextLevelButton').hide() # Might conflict with DailyGame, who knows
		self.level_complete_controls_h_box_container.find_child('NextLevelButton').text = "Demo Complete <3"
		self.level_complete_controls_h_box_container.find_child('RestartButton').grab_focus()
		self.level_complete_controls_h_box_container.find_child('NextLevelButton').disabled = true
		return
	self.level_complete_controls_h_box_container.find_child('NextLevelButton').disabled = false
	self.level_complete_controls_h_box_container.find_child('NextLevelButton').grab_focus()

func _on_game_over_timer_timeout():
	is_game_over = true
	self.level_complete_controls_h_box_container.show()
	self.level_complete_controls_h_box_container.find_child('NextLevelButton').disabled = true
	self.level_complete_controls_h_box_container.find_child('RestartButton').grab_focus()

func game_over():
	# Experiment with allowing user to hit undo.
	#self.disable_player_interaction = true
	SoundManager.play("nonmovement")
	SoundManager.play("nonmovement")
	game_over_timer.start(1)


func update_game_display():
	var text = "[center]"
	text += "Level " + str(level_number) + '\n'
	text += "Score: " + str(alchemizations)  + '\n'
		
	if best_score != -1:
		text += "\nTop Score: " + str(best_score)

	self.game_details_value.text = text
	
