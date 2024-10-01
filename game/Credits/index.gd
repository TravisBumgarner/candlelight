extends Control

const main_menu = preload("res://MainMenu/main_menu.tscn")

func _init():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)
