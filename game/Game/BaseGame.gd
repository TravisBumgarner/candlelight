extends Node2D

class_name BaseGame

# _init params Alphabetical
var board_tile_map: TileMap
var queue_tile_map: TileMap
var level_complete_timer: Timer
var sounds: Node
var game_details_label: Label
var game_details_value: RichTextLabel
var game_details_tile_map: TileMap
var instructions: VBoxContainer
var return_to_main_menu: Callable
var submit_score_button: Button
var target_gem_tile_map: TileMap
# end _init Params Alphabetical

# Local Params
var history: History
var player: Player
var queue: Queue
var gemsManager: GemsManager
var level: int
var alchemizations: int
var game_start_timestamp: int
var is_paused_for_scoring = false
# end Local Params

func _init(args: Array):
	# Alphabetical
	self.board_tile_map = args[0]
	self.game_details_label = args[1]
	self.game_details_tile_map = args[2]
	self.game_details_value =args[3]
	self.instructions = args[4]
	self.level_complete_timer = args[5]
	self.queue_tile_map = args[6]
	self.return_to_main_menu = args[7]
	self.sounds = args[8]
	self.submit_score_button = args[9]
	self.target_gem_tile_map = args[10]
	# Alphabatical
	print("huh", self.instructions, args[4])
	
	SoundManager.connect("play_sound", sounds.play_sound)
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	level_complete_timer.connect('timeout', _on_level_complete_timer_timeout)
	self.submit_score_button.connect('pressed', Callable(self, "_on_submit_pressed"))

func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	SoundManager.disconnect("play_sound", sounds.play_sound)
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	self.level_complete_timer.disconnect('timeout', _on_level_complete_timer_timeout)
	self.submit_score_button.disconnect('pressed', Callable(self, "_on_submit_pressed"))

func _on_action_pressed(action):
	var direction_map = {
		"up": Vector2i.UP,
		"down": Vector2i.DOWN,
		"left": Vector2i.LEFT,
		"right": Vector2i.RIGHT
	}
	
	if action in direction_map:
		if player.current_absolute_position[1] == -3 and action == 'down':
			# Move player down into game board if they're starting in the new area.
			player.move(Vector2i(0, 3))		
		else:
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
	
	history.append(self.board_tile_map, player.shape)
	player.place_on_board()
	var gems = gemsManager.find_gems_and_shapes()['gems']
	if(gems.size() > 0):
		level_complete(gems)
		return
	player = Player.new(self.board_tile_map, self.queue.next())
	player.draw()
	
	alchemizations += 1
	update_game_display()
	

func level_complete(_gems):
	assert(false, "Must be implemented in the child class.")

func _on_level_complete_timer_timeout():
	assert(false, "Must be implemented in the child class.")

func undo():
	var record = history.pop()

	self.queue.undo(player.shape)
	
	Utilities.array_to_tile_map(board_tile_map, GlobalConsts.BOARD_LAYER.PLACED_SHAPES, record.placed_shapes)

	player = Player.new(self.board_tile_map, record.shape)
	player.draw()
	
	if alchemizations > 0:
		alchemizations -= 1
		update_game_display()

func erase_board():
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.PLACED_SHAPES)
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_SHAPE)

func new_game():
	assert(false, "Must be implemented in the child class.")

func load_game():
	assert(false, "Must be implemented in the child class.")

func update_game_display():
	assert(false, "Must be implemented in the child class.")

func _on_submit_pressed():
	assert(false, "Must be implemented in the child class.")
