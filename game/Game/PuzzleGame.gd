extends BaseGame
class_name PuzzleGame

func _init(args):                
	super(args)

func new_game():
	self.disable_player_interaction = false
	self.puzzle_complete_hbox_container.hide()
	erase_board()
	self.alchemizations = 0
		
	var config = PuzzleModeLevelManager.get_level_data(level)

	var visible_queue_size = 3
	var game_key = null
	var should_fill_queue = false
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size, should_fill_queue)
	queue.load(config.get_value('level', GlobalConsts.PUZZLE_GAME_SAVE_KEY.QUEUE))
	
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	var target_gem = config.get_value('level', GlobalConsts.PUZZLE_GAME_SAVE_KEY.TARGET_GEM)
	gemsManager.free_play_mode_resume(target_gem)
	
	update_game_display()
	
	self.history = History.new()

	player = Player.new(board_tile_map, queue.next())

func level_complete(gems):
	disable_player_interaction = true
	
	SoundManager.play("one_gem")

	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(1)

func _on_action_pressed(action):
	super(action)

func _on_level_complete_timer_timeout():
	disable_player_interaction = false
	self.puzzle_complete_hbox_container.show()

func game_over():
	self.disable_player_interaction = true
	SoundManager.play("nonmovement")
	SoundManager.play("nonmovement")
	self.puzzle_complete_hbox_container.show()

func update_game_display():
	var text = "[center]"
	text += "Level " + str(level) + '\n'
	text += str(alchemizations) + " Alchemization"
	if alchemizations != 1:
		text += "s"
	
	self.game_details_value.text = text
	
