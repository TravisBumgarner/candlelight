extends Node2D

@onready var target_gem_tile_map = $TargetGemTileMap

var gemPlacer: GemPlacer

# Called when the node enters the scene tree for the first time.
func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	gemPlacer = GemPlacer.new(target_gem_tile_map)
	gemPlacer.draw_piece()
	
func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	var direction_map = {
		"up": Vector2i.UP,
		"down": Vector2i.DOWN,
		"left": Vector2i.LEFT,
		"right": Vector2i.RIGHT
	}
	
	if action in direction_map:
		gemPlacer.move(direction_map[action])
	
	match action:
		"select":
			gemPlacer.place_on_board()
		"escape":
			cleanup()
			print('escaping')
			#self.return_to_main_menu.call()
