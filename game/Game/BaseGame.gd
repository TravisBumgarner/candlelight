extends Node2D

class_name BaseGame

var board_tile_map: TileMap
var target_gem_tile_map: TileMap
var queue_tile_map: TileMap
var level_complete_timer
var sounds
var game_details_label
var game_details_value
var game_details_tile_map: TileMap

var history: History
var player: Player
var queue: Queue
var gemsManager: GemsManager
var level: int
var alchemizations: int
var instructions
var return_to_main_menu

var is_paused_for_scoring = false

func _init(_board_tile_map: TileMap, _target_gem_tile_map, _queue_tile_map, _level_complete_timer, _sounds, _game_details_label, _game_details_value, _game_details_tile_map, _instructions, _return_to_main_menu):
	self.board_tile_map = _board_tile_map
	self.target_gem_tile_map = _target_gem_tile_map
	self.queue_tile_map = _queue_tile_map
	self.level_complete_timer = _level_complete_timer
	self.sounds = _sounds
	self.game_details_label = _game_details_label
	self.game_details_value = _game_details_value
	self.game_details_tile_map = _game_details_tile_map
	self.instructions = _instructions
	self.return_to_main_menu = _return_to_main_menu
	
	SoundManager.connect("play_sound", sounds.play_sound)
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	level_complete_timer.connect('timeout', _on_level_complete_timer_timeout)

func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	SoundManager.disconnect("play_sound", sounds.play_sound)
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	level_complete_timer.disconnect('timeout', _on_level_complete_timer_timeout)
	

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
			cleanup()
			self.return_to_main_menu.call()

func handle_player_placement():
	if not player.can_place():
		SoundManager.play("nonmovement")
		return
	
	history.append(self.board_tile_map, player)
	player.place_on_board()
	var gems = gemsManager.find_gems()
	if(gems.size() > 0):
		level_complete(gems)
		return
	player = Player.new(self.board_tile_map, self.queue.next())
	player.draw_piece()
	
	alchemizations += 1
	update_things()
	

func level_complete(_gems):
	assert(false, "Must be implemented in the child class.")

func _on_level_complete_timer_timeout():
	assert(false, "Must be implemented in the child class.")

func undo():
	var record = history.pop()
	self.queue.undo(player.piece_type)
	player = record.player
	
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.PLACED_PIECES)
	
	for x in range(GlobalConsts.GRID.WIDTH):
		for y in range(GlobalConsts.GRID.HEIGHT):
			var tile_style = record.atlas_coords_array[x][y]
			self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.PLACED_PIECES, Vector2i(x,y), GlobalConsts.GEMS_TILE_ID, tile_style)

	player.draw_piece()
	
	if alchemizations > 0:
		alchemizations -= 1
		update_things()

func erase_board():
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.PLACED_PIECES)
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_PIECE)

func new_game():
	assert(false, "Must be implemented in the child class.")

func load_game(game_save_data):
	assert(false, "Must be implemented in the child class.")

func update_things():
	assert(false, "Must be implemented in the child class.")
