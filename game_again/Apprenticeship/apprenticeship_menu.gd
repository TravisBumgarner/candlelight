extends Node

@onready var main_menu = preload("res://MainMenu/main_menu.tscn")
@onready var game = preload("res://game.tscn")

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	match action:
		"escape":
			get_tree().change_scene_to_packed(main_menu)
		"select":
			GlobalState.gameMode = GlobalConsts.GAME_MODE.ApprenticeshipGame
			get_tree().change_scene_to_packed(game)
