extends BaseGame
class_name DailyGame

func _init(_board_tile_map: TileMap, _target_gem_tile_map: TileMap, _queue_tile_map: TileMap, _level_complete_timer, _sounds, _game_details_label, _game_details_value, _game_details_tile_map, _instructions, _return_to_main_menu):
	super(_board_tile_map, _target_gem_tile_map, _queue_tile_map, _level_complete_timer, _sounds, _game_details_label, _game_details_value, _game_details_tile_map, _instructions, _return_to_main_menu)
func level_complete(gems):
	SoundManager.play("two_gems")	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(1)

func _on_level_complete_timer_timeout():
	print('See you tomorrow!')

func new_game():
	var key = Utilities.generate_key_from_date()
	
	update_stats()
	erase_board()
	alchemizations = 0
	history = History.new()
	var visible_queue_size = 3
	queue = Queue.new(queue_tile_map, key, visible_queue_size)
	queue.fill_queue()
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.daily_mode_set_target_gem(key)

func update_stats():
	var text = "[center]"
	text += str(alchemizations) + "Alchemization"
	if alchemizations != 1:
		text += "s"
	
	game_details_value.text = text
