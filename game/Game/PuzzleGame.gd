extends BaseGame
class_name PuzzleGame

# Called when the node enters the scene tree for the first time.
func _init(_board_tile_map: TileMap, _target_gem_tile_map: TileMap, _queue_tile_map: TileMap, _level_complete_timer, _sounds, _game_details_label, _game_details_value, _game_details_tile_map, _instructions, _return_to_main_menu):
	super(_board_tile_map, _target_gem_tile_map, _queue_tile_map, _level_complete_timer, _sounds, _game_details_label, _game_details_value, _game_details_tile_map, _instructions, _return_to_main_menu)

func new_game():
	game_start_timestamp = Time.get_unix_time_from_system()
	erase_board()
	level = 1
	alchemizations = 1
	update_game_display()
	self.history = History.new()
	var visible_queue_size = 3
	var game_key = null
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
	queue.fill_queue()
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)


func load_game():
	var config = ConfigFile.new()
	config.load(GlobalState.game_save_file)
	game_start_timestamp = config.get_value("save", "game_start_timestamp")
	level = config.get_value("save", "level", level)
	alchemizations = config.get_value("save", "level")
	history = History.new()
	print('history', config.get_value("save", "history"))
	history.load(config.get_value("save", "history"))
	var visible_queue_size = 3
	var game_key = null
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
	queue.load(config.get_value("save", "queue"))
	player = Player.new(board_tile_map, config.get_value("save", "player_shape"))
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)
	update_game_display()

func level_complete(gems):
	var total_gems = gems.size()
	
	if total_gems == 1:
		SoundManager.play("one_gem")
	if total_gems >= 2:
		SoundManager.play("two_gems")
			
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	is_paused_for_scoring = true
	level_complete_timer.start(1)

func _on_action_pressed(action):
	super(action)
	save_game()

func save_game():
	var config = ConfigFile.new()
	config.set_value("save", "level", level)
	config.set_value("save", "alchemizations", alchemizations)
	config.set_value("save", "queue", queue.get_queue())
	config.set_value("save", "game_start_timestamp", game_start_timestamp)
	config.set_value("save", "history", history.get_history())
	config.set_value("save", "player_shape", player.shape)
	config.set_value("save", "human_readable_last_played", Utilities.human_readable_current_time())
	#config.set_value("save", "board", )
	config.save(Utilities.get_save_game_path(GlobalConsts.GAME_SAVE_KEYS.PUZZLE_GAME, game_start_timestamp))

func gems_to_walls():
	for x in range(GlobalConsts.GRID.WIDTH):
		for y in range(GlobalConsts.GRID.HEIGHT):
			var tile_style = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_PIECES,Vector2i(x,y))

			if tile_style == GlobalConsts.SPRITE.GEM_BLUE_INACTIVE:
				self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.BLOCKERS, Vector2i(x,y), GlobalConsts.GEMS_TILE_ID, GlobalConsts.SPRITE.GEM_BLUE_INACTIVE)


func _on_level_complete_timer_timeout():
	level += 1
	update_game_display()
	gems_to_walls()
	erase_board()
	gemsManager.puzzle_mode_set_target_gem(level)
	player = Player.new(board_tile_map, self.queue.next())
	is_paused_for_scoring = false

func update_game_display():
	var text = "[center]"
	text += "Level " + str(level) + '\n'
	text += str(alchemizations) + " Alchemization"
	if alchemizations != 1:
		text += "s"
	
	game_details_value.text = text
	
