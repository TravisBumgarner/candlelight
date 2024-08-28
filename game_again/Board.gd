extends Node2D

class_name BaseGame

@onready var tile_map = $TileMap

#var history: History

var player: Player
var queue: Queue
var can_process_input = true
#var gemsManager: GemsManager

signal experiment_completed
signal experiment_undo
signal game_key_set

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	new_game()

func _on_action_pressed(action):
	var direction_map = {
		"up": Vector2i.UP,
		"down": Vector2i.DOWN,
		"left": Vector2i.LEFT,
		"right": Vector2i.RIGHT
	}
	
	if action in direction_map:
		player.move(direction_map[action])
	
	match action:
		"undo":
			print("undo action triggered")
		"rotate":
			player.rotate_right()
		"select":
			player.place_on_board()
			player = Player.new(tile_map, queue.next())


#func _input():
	#elif Input.is_action_pressed("UNDO"):
		#if history.size() == 0:
			#SoundManager.play("nonmovement")
			#start_debounce()
			#return
		#self.undo()
		#start_debounce()
	#elif Input.is_action_pressed("PLACE"):
		#emit_signal('experiment_completed')
		#history.append(tile_map, player)
		#player.draw_piece_on_board()
		#
		#var gems = gemsManager.find_gems()
		#if(gems.size() > 0):
			#level_complete(gems)
			#return
		## If player hasn't won this level, we need to draw a new piece. 
		## Otherwise, new piece is drawn after level complete. 
		#start_place_piece_on_board_timer()
		


func level_complete(gems):
	pass

#func undo():
	#var record = history.pop_back()
	#if record == null:
		#return
	#self.queue.undo(player.piece_type)
	#player.erase_piece()
	#player = record.player
	#player.draw_piece()
	#emit_signal('experiment_undo')
	#for x in range(GlobalConsts.GRID.WIDTH):
		#for y in range(GlobalConsts.GRID.HEIGHT):
			#var tile_style = record.atlas_coords_array[x][y]
			#self.tile_map.erase_cell(GlobalConsts.Layer.Board, Vector2i(x,y))
			##if tile_style != Vector2i(-1, -1):
			#self.tile_map.set_cell(GlobalConsts.Layer.Board, Vector2i(x,y), GlobalConsts.GEMS_TILE_ID, tile_style)


#func start_debounce():
	#can_process_input = false
	#debounce_timer.start(GlobalConsts.DEBOUNCE_TIMER)


#func start_place_piece_on_board_timer():
	#can_process_input = false
	#place_piece_on_board_timer.start(GlobalConsts.PLACE_PIECE_ON_BOARD_TIMER)


#func _on_debounce_timer_timeout():
	#can_process_input = true
#

#func _on_place_piece_on_board_timer_timeout():
	#can_process_input = true
	#player = Player.new(tile_map, queue.get_next_from_queue())

func erase_board():
	tile_map.clear_layer(GlobalConsts.BOARD_LAYER.PLACED_PIECES)
	tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_PIECE)

func new_game():
	erase_board()
	#history = History.new()
	queue = Queue.new(tile_map, null)
	player = Player.new(tile_map, queue.next())
 
	
func reset():
	pass
	



