extends BaseGame
class_name DailyGame

func _init(args):                
	super(args)

func level_complete(gems):
	SoundManager.play("two_gems")	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(1)

func _on_level_complete_timer_timeout():
	print('See you tomorrow!')

func new_game():
	var key = Utilities.generate_key_from_date()
	
	update_game_display()
	erase_board()
	alchemizations = 0
	history = History.new()
	var visible_queue_size = 3
	queue = Queue.new(queue_tile_map, key, visible_queue_size)
	queue.fill_queue()
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.daily_mode_set_target_gem(key)

func update_game_display():
	var text = "[center]"
	text += str(alchemizations) + "Alchemization"
	if alchemizations != 1:
		text += "s"
	
	game_details_value.text = text
	

