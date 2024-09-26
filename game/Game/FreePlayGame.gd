extends BaseGame
class_name FreePlayGame

func _init(args):                
	super(args)

func new_game():
	game_start_timestamp = Time.get_unix_time_from_system()
	
	erase_board()
	
	level = 1
	alchemizations = 0
	update_game_display()
	
	self.history = History.new()
	
	var visible_queue_size = 3
	var game_key = null
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
	queue.fill_queue()
	
	player = Player.new(board_tile_map, queue.next())
	
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.free_play_mode_set_target_gem(level)


func load_game():
	var config = ConfigFile.new()
	config.load(GlobalState.game_save_file)
	
	GlobalState.player_name = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLAYER_NAME)
	
	game_start_timestamp = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.GAME_START_TIMESTAMP)
	
	level = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.LEVEL, level)
	alchemizations = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.LEVEL)
	
	history = History.new()
	history.load(config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.HISTORY))
	
	var visible_queue_size = 3
	var game_key = null
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
	queue.load(config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.QUEUE))
	
	player = Player.new(board_tile_map, config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLAYER_SHAPE))
	
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	var target_gem = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.TARGET_GEM)
	gemsManager.free_play_mode_resume(target_gem)
	
	var placed_shapes_array = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLACED_SHAPES)
	Utilities.array_to_tile_map(board_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES, placed_shapes_array)

	#var blockers_array = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.BLOCKERS)
	#Utilities.array_to_tile_map(board_tile_map, GlobalConsts.BOARD_LAYER.BLOCKERS, blockers_array)
	
	update_game_display()

func level_complete(gems):
	disable_player_interaction = true
	var total_gems = gems.size()
	
	if total_gems == 1:
		SoundManager.play("one_gem")
	if total_gems >= 2:
		SoundManager.play("two_gems")
			
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(1)

func _on_action_pressed(action):
	super(action)
	
	if level > 1:
		# Don't start saving until the user has made some progress
		create_game_save()

func delete_game_save():
	var absolute_file_path = Utilities.get_save_game_path(GlobalConsts.GAME_SAVE_KEYS.FREE_PLAY_GAME, game_start_timestamp)

	if FileAccess.file_exists(absolute_file_path):
		DirAccess.remove_absolute(absolute_file_path)

func create_game_save():
	var config = ConfigFile.new()
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.LEVEL, level)
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.ALCHEMIZATIONS, alchemizations)
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.QUEUE, queue.get_queue())
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.GAME_START_TIMESTAMP, game_start_timestamp)
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.HISTORY, history.get_history())
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLAYER_SHAPE, player.shape)
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLAYER_NAME, GlobalState.player_name)
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLACED_SHAPES, Utilities.tile_map_to_array(board_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES))
	#config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.BLOCKERS, Utilities.tile_map_to_array(board_tile_map, GlobalConsts.BOARD_LAYER.BLOCKERS))
	config.set_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.TARGET_GEM, gemsManager.get_target_gem())
	config.save(Utilities.get_save_game_path(GlobalConsts.GAME_SAVE_KEYS.FREE_PLAY_GAME, game_start_timestamp))

#func gems_to_walls():
	#for x in range(GlobalConsts.GRID.WIDTH):
		#for y in range(GlobalConsts.GRID.HEIGHT):
			#var tile_style = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_SHAPES,Vector2i(x,y))
#
			#if tile_style == GlobalConsts.SPRITE.GEM_BLUE_INACTIVE:
				#self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.BLOCKERS, Vector2i(x,y), GlobalConsts.GEMS_TILE_ID, GlobalConsts.SPRITE.GEM_BLUE_INACTIVE)
#

#func _on_submit_pressed():
	#PuzzleModeHighScores.add_high_score(alchemizations, level)
	#delete_game_save()
	#new_game()


func _on_level_complete_timer_timeout():
	disable_player_interaction = false
	level += 1
	update_game_display()
	#gems_to_walls()
	erase_board()
	history.empty()
	gemsManager.free_play_mode_set_target_gem(level)
	player = Player.new(board_tile_map, self.queue.next())

func update_game_display():
	var text = "[center]"
	text += "Level " + str(level) + '\n'
	text += str(alchemizations) + " Alchemization"
	if alchemizations != 1:
		text += "s"
	
	self.game_details_value.text = text
	
