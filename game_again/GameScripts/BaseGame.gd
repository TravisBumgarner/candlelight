extends Node2D

class_name BaseGame

var board_tile_map
var target_gem_tile_map
var queue_tile_map
var level_complete_timer
var sounds
var game_details_label
var game_details_value

var history: History
var player: Player
var queue: Queue
var gemsManager: GemsManager
var level
var instructions
var return_to_main_menu

var is_paused_for_scoring = false

func _init(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, instructions, return_to_main_menu):
	self.board_tile_map = board_tile_map
	self.target_gem_tile_map = target_gem_tile_map
	self.queue_tile_map = queue_tile_map
	self.level_complete_timer = level_complete_timer
	self.sounds = sounds
	self.game_details_label = game_details_label
	self.game_details_value = game_details_value
	self.instructions = instructions
	self.return_to_main_menu = return_to_main_menu
	
	SoundManager.connect("play_sound", sounds.play_sound)
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	level_complete_timer.connect('timeout', _on_level_complete_timer_timeout)

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
				SoundManager.play("nonmovement")
				return
			self.undo()
		"rotate":
			player.rotate_right()
		"select":
			self.handle_player_placement()
		"escape":
			self.return_to_main_menu.call()

func handle_player_placement():
	assert(false, "Must be implemented in the child class.")

func level_complete(gems):
	assert(false, "Must be implemented in the child class.")

func _on_level_complete_timer_timeout():
	assert(false, "Must be implemented in the child class.")

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
	assert(false, "Must be implemented in the child class.")

func update_stats():
	assert(false, "Must be implemented in the child class.")
