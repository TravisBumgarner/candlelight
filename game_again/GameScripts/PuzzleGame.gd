extends BaseGame
class_name PuzzleGame

# Called when the node enters the scene tree for the first time.
func _init(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, game_details_tile_map, instructions, return_to_main_menu):
	super(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, game_details_tile_map, instructions, return_to_main_menu)

func new_game():
	update_stats()
	erase_board()
	level = 1
	history = History.new()
	queue = Queue.new(queue_tile_map, null)
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)

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


func _on_level_complete_timer_timeout():
	level += 1
	erase_board()
	gemsManager.puzzle_mode_set_target_gem(level)
	player = Player.new(board_tile_map, self.queue.next())
	is_paused_for_scoring = false

func update_stats():
	game_details_label.text = "hello"
	game_details_value.text = "world"
