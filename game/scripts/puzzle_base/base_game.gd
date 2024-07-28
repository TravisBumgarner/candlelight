extends Node2D

class_name BaseGame

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_board_timer = $PlacePieceOnBoardTimer
@onready var tile_map = $TileMap


var current_piece: Piece
var queue: Queue
var can_process_input = true
var gemsManager: GemsManager

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
				level_complete(gems)
				return
			start_place_piece_on_board_timer()


func level_complete(gems):
	pass

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

func new_game():
	pass

func _ready():
	new_game()
