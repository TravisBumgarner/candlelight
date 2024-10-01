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
	
	player = Player.new(board_tile_map, queue.next())
	
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.free_play_mode_set_target_gem(level)


func load_game():
	var config = ConfigFile.new()
	var absolute_file_path = "user://game_saves/%s/%s.save" % [GlobalConsts.GAME_MODE.FreePlay, GlobalState.save_slot]
	config.load(absolute_file_path)
		
	alchemizations = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.ALCHEMIZATIONS)
	level = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.LEVEL, level)
	game_start_timestamp = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.GAME_START_TIMESTAMP)
	
	history = History.new()
	history.load(config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.HISTORY))
	
	var visible_queue_size = 3
	var game_key = null
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
	queue.load(config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.QUEUE))
	
	player = Player.new(board_tile_map, config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.SHAPE_NAME))
	
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	var target_gem = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.TARGET_GEM)
	gemsManager.set_gem(target_gem)
	
	var placed_shapes_array = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.PLACED_SHAPES)
	Utilities.array_to_tile_map(board_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES, placed_shapes_array)

	#var blockers_array = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.BLOCKERS)
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
	
func upsert_game_save():
	var config = ConfigFile.new()
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.LEVEL, level)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.ALCHEMIZATIONS, alchemizations)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.QUEUE, queue.get_queue())
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.GAME_START_TIMESTAMP, game_start_timestamp)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.HISTORY, history.get_history())
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.SHAPE_NAME, player.shape_name)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.PLACED_SHAPES, Utilities.tile_map_to_array(board_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES))
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.TARGET_GEM, gemsManager.get_target_gem())
	Utilities.write_game_save_v2(GlobalConsts.GAME_MODE.FreePlay, GlobalState.save_slot, config)

func _on_level_complete_timer_timeout():
	disable_player_interaction = false
	level += 1
	update_game_display()
	#gems_to_walls()
	erase_board()
	history.empty()
	gemsManager.free_play_mode_set_target_gem(level)
	player = Player.new(board_tile_map, self.queue.next())
	if level > 1:
		# Don't start saving until the user has made some progress
		upsert_game_save()

func update_game_display():
	var text = "[center]"
	text += "Level " + str(level) + '\n'
	text += str(alchemizations) + " Alchemization"
	if alchemizations != 1:
		text += "s"
	
	self.game_details_value.text = text
	
