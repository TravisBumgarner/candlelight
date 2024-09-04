extends BaseGame
class_name DailyGame

var experiments := 0

func _init(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, game_details_tile_map, instructions, hello):
	super(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, game_details_tile_map, instructions, hello)

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
	experiments = 0
	history = History.new()
	queue = Queue.new(queue_tile_map, key) # TODO - Set this up
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.daily_mode_set_target_gem(key)

func undo():
	super()
	if experiments > 0:
		experiments -= 1
		update_stats()

func handle_player_placement():
	experiments += 1
	super()
	update_stats()

func update_stats():
	var text = "[center]"
	text += str(experiments) + "\n"
	text += "Alchemizations"
	
	game_details_value.text = text
