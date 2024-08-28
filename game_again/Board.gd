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
