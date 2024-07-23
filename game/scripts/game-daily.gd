extends Node2D

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_board_timer = $PlacePieceOnBoardTimer
@onready var tile_map = $TileMap

var current_piece: Piece
var queue: Queue
var can_process_input = true
var gemsManager: GemsManager
@onready var level_label = $"../Level"

signal experiment_completed

func _process(_delta):
	if can_process_input:
		if Input.is_action_pressed("MOVE_DOWN"):
			current_piece.move_piece(Vector2i.DOWN)
			start_debounce()
		elif Input.is_action_pressed("MOVE_UP"):
			current_piece.move_piece(Vector2i.UP)
			start_debounce()
		elif Input.is_action_pressed("MOVE_RIGHT"):
			current_piece.move_piece(Vector2i.RIGHT)
			start_debounce()
		elif Input.is_action_pressed("MOVE_LEFT"):
			current_piece.move_piece(Vector2i.LEFT)
			start_debounce()
		elif Input.is_action_pressed("ROTATE"):
			current_piece.rotate_piece()
			start_debounce()
		elif Input.is_action_pressed("PLACE"):
			emit_signal('experiment_completed')
			current_piece.draw_piece_on_board()
			
			var gems = gemsManager.find_gems()
			if(gems.size() > 0):
				daily_complete(gems)
				return
			start_place_piece_on_board_timer()


func daily_complete(gems):
	can_process_input = false
	SoundManager.play("two_gems")	
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)


func start_debounce():
	can_process_input = false
	debounce_timer.start(Consts.DEBOUNCE_TIMER)


func start_place_piece_on_board_timer():
	can_process_input = false
	place_piece_on_board_timer.start(Consts.PLACE_PIECE_ON_BOARD_TIMER)


func _on_debounce_timer_timeout():
	can_process_input = true


func _on_place_piece_on_board_timer_timeout():
	can_process_input = true
	current_piece = Piece.new(tile_map, queue.get_next_from_queue())


func _on_level_complete_timer_timeout():
	Utils.erase_area(tile_map, Vector2i(1, 1), Vector2i(Consts.WIDTH + 1, Consts.HEIGHT + 1), Consts.Layer.Board)
	can_process_input = true
	current_piece = Piece.new(tile_map, queue.get_next_from_queue())


func new_game():
	print('new game')
	gemsManager.daily_mode_set_target_gem()
	current_piece = Piece.new(tile_map, queue.get_next_from_queue())


func _ready():
	print('daily')
	queue = Queue.new(tile_map)
	gemsManager = GemsManager.new(tile_map)
	new_game()
