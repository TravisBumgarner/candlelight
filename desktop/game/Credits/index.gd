extends Control
@onready var travis_button: Button = $CenterContainer/VBoxContainer/Travis/TravisButton

const main_menu = preload("res://MainMenu/main_menu.tscn")

func _init():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _ready():
	travis_button.grab_focus()

func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)

func _on_travis_button_pressed() -> void:
	OS.shell_open("http://travisbumgarner.dev/")

func _on_helena_button_pressed() -> void:
	OS.shell_open("https://departuremono.com/")
	
