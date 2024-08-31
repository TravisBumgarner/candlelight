extends Node

@onready var main_menu = preload("res://MainMenu/main_menu.tscn")

func _ready():
	print('init')
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	print('action pressed')
	match action:
		"escape":
			get_tree().change_scene_to_packed(main_menu)
		"select":
			print('beginning demo')
