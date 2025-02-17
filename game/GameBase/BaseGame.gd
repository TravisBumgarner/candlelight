extends Node2D

class_name BaseGame

# _init params Alphabetical
var board_tile_map: TileMap
var game_complete_controls_center_container: CenterContainer
var game_complete_timer: Timer
var game_details_label: Label
var game_details_value: RichTextLabel
var game_details_control: Control
var level_complete_controls_center_container: CenterContainer
var level_complete_timer: Timer
var game_over_timer: Timer
var instructions_container: VBoxContainer
var pause_menu_container
var queue_control: Control
var sounds: Node
var target_gem_control: Control
# end _init Params Alphabetical

# Local Params
var history: History
var player: Player
var queue: Queue
var gemsManager: GemsManager
var level_number: int
var world_number: int # Currently just used for Puzzles
var alchemizations: int
var game_start_timestamp: int
var disable_player_interaction = false

# end Local Params

func _init(args: Array):
	# Alphabetical
	MusicPlayer.play_game_music()
	var counter = 0
	self.board_tile_map = args[counter]
	counter += 1
	self.game_complete_controls_center_container = args[counter]
	counter += 1
	self.game_complete_timer = args[counter]
	counter += 1
	self.game_details_label = args[counter]
	counter += 1
	self.game_details_control = args[counter]
	counter += 1
	self.game_details_value = args[counter]
	counter += 1
	self.game_over_timer = args[counter]
	counter += 1
	self.instructions_container = args[counter]
	counter += 1
	self.level_complete_controls_center_container = args[counter]
	counter += 1
	self.level_complete_timer = args[counter]
	counter += 1
	self.pause_menu_container = args[counter]
	counter += 1
	self.queue_control = args[counter]
	counter += 1
	self.sounds = args[counter]
	counter += 1
	self.target_gem_control = args[counter]
	counter += 1
	# Alphabatical
	
	SoundManager.connect("play_sound", sounds.play_sound)
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	level_complete_timer.connect('timeout', _on_level_complete_timer_timeout)
	game_complete_timer.connect('timeout', _on_game_complete_timer_timeout)
	game_over_timer.connect('timeout', _on_game_over_timer_timeout)

func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	SoundManager.disconnect("play_sound", sounds.play_sound)
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	self.level_complete_timer.disconnect('timeout', _on_level_complete_timer_timeout)
	self.game_complete_timer.disconnect('timeout', _on_game_complete_timer_timeout)
	self.game_over_timer.disconnect('timeout', _on_game_over_timer_timeout)

func _on_action_pressed(action):
	if disable_player_interaction and action != 'escape':
		return
	
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
			self.pause()
			self.pause_menu_container.show()

func handle_player_placement():
	if not player.can_place():
		SoundManager.play("nonmovement")
		return
	
	history.append(self.board_tile_map, player.shape_name)
	player.place_on_board()
	
	alchemizations += 1
	update_game_display()
	
	var gems = gemsManager.find_gems_and_shapes()['gems']
	if(gems.size() > 0):
		level_complete(gems)
		return
	var next_shape = self.queue.next()
	if next_shape == null:
		# Currently only used for puzzle mode
		self.game_over()
	else:
		player = Player.new(self.board_tile_map, next_shape)

func level_complete(_gems):
	assert(false, "Must be implemented in the child class.")

func _on_level_complete_timer_timeout():
	assert(false, "Must be implemented in the child class.")

func _on_game_complete_timer_timeout():
	assert(false, "Must be implemented in the child class.")

func _on_game_over_timer_timeout():
	assert(false, "Must be implemented in the child class.")

func game_over():
	assert(false, "Must be implemented in the child class.")

func undo():
	var record = history.pop()
	
	# At game end, shape_name is null.
	if player.shape_name != null:
		self.queue.undo(player.shape_name)
	
	Utilities.array_to_tile_map(board_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES, record.placed_shapes)

	player = Player.new(self.board_tile_map, record.shape_name)
	
	if alchemizations > 0:
		alchemizations -= 1
		update_game_display()

func erase_board():
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.PLACED_SHAPES)
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_SHAPE)

func resume():
	self.disable_player_interaction = false

func pause():
	self.disable_player_interaction = true

func new_game():
	assert(false, "Must be implemented in the child class.")

func load_game():
	assert(false, "Must be implemented in the child class.")

func update_game_display():
	assert(false, "Must be implemented in the child class.")

func _on_submit_pressed():
	assert(false, "Must be implemented in the child class.")
