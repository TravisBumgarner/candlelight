extends Node

@onready var main_menu = load("res://MainMenu/main_menu.tscn")
@onready var game_scene = load("res://Game/game_board.tscn")

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	match action:
		"escape":
			print('main menu a')
			get_tree().change_scene_to_packed(main_menu)
		"select":
			GlobalState.game_mode = GlobalConsts.GAME_MODE.Tutorial
			get_tree().change_scene_to_packed(game_scene)
