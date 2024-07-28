extends Node2D

class_name BaseGame

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_board_timer = $PlacePieceOnBoardTimer
@onready var tile_map = $TileMap
var history: History

var player: Player
var queue: Queue
var can_process_input = true
var gemsManager: GemsManager

func _process(_delta):
	if can_process_input:
		if Input.is_action_pressed("MOVE_DOWN"):
			player.move_piece(Vector2i.DOWN)
			start_debounce()
		elif Input.is_action_pressed("MOVE_UP"):
			player.move_piece(Vector2i.UP)
			start_debounce()
		elif Input.is_action_pressed("MOVE_RIGHT"):
			player.move_piece(Vector2i.RIGHT)
			start_debounce()
		elif Input.is_action_pressed("MOVE_LEFT"):
			player.move_piece(Vector2i.LEFT)
			start_debounce()
		elif Input.is_action_pressed("ROTATE"):
			player.rotate_piece()
			start_debounce()
		elif Input.is_action_pressed("PLACE"):
			emit_signal('experiment_completed')
			player.draw_piece_on_board()
			history.append(player)
			
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
	player = Player.new(tile_map, queue.get_next_from_queue())

func new_game():
	history = History.new()

func _ready():
	new_game()
	
	