extends BaseGame

var game_key: int
@onready var level_label = $"../Level"

signal experiment_completed
signal game_key_set

# Function called from BaseGame when level completes.
func daily_complete(gems):
	can_process_input = false
	SoundManager.play("two_gems")	
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)


func _on_level_complete_timer_timeout():
	Utils.erase_area(tile_map, Vector2i(1, 1), Vector2i(Consts.WIDTH + 1, Consts.HEIGHT + 1), Consts.Layer.Board)
	can_process_input = true
	current_piece = Piece.new(tile_map, queue.get_next_from_queue())


func new_game():
	game_key = Utils.generate_key_from_date()
	queue = Queue.new(tile_map, game_key)
	gemsManager = GemsManager.new(tile_map)
	
	emit_signal('game_key_set', game_key)
	gemsManager.daily_mode_set_target_gem(game_key)
	current_piece = Piece.new(tile_map, queue.get_next_from_queue())


func _ready():
	new_game()
