extends Node2D

class_name BaseGame

@onready var board_tile_map = $BoardTileMap
@onready var target_gem_tile_map = $TargetGemTileMap
@onready var queue_tile_map = $QueueTileMap

var history: History
var player: Player
var queue: Queue
var gemsManager: GemsManager
var level

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
			if history.size() == 0:
				#SoundManager.play("nonmovement")
				return
			self.undo()
		"rotate":
			player.rotate_right()
		"select":
			history.append(board_tile_map, player)
			player.place_on_board()
			player = Player.new(board_tile_map, queue.next())

func level_complete(gems):
	pass

# This could be split into multiple functions. 
func undo():
	var record = history.pop()
	if record == null:
		return
	self.queue.undo(player.piece_type)
	#player.erase_piece()
	player = record.player
	player.draw_piece()
	#emit_signal('experiment_undo')
	for x in range(GlobalConsts.GRID.WIDTH):
		for y in range(GlobalConsts.GRID.HEIGHT):
			var tile_style = record.atlas_coords_array[x][y]
			self.board_tile_map.erase_cell(GlobalConsts.BOARD_LAYER.PLACED_PIECES, Vector2i(x,y))
			#if tile_style != Vector2i(-1, -1):
			self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.PLACED_PIECES, Vector2i(x,y), GlobalConsts.GEMS_TILE_ID, tile_style)

func erase_board():
	board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.PLACED_PIECES)
	board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_PIECE)

func new_game():
	level = 1
	erase_board()
	history = History.new()
	queue = Queue.new(queue_tile_map, null)
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)
