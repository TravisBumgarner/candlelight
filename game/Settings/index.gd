extends Control

const main_menu = preload("res://MainMenu/main_menu.tscn")
@onready var music = $CenterContainer/VBoxContainer/HBoxContainer/Music
@onready var sfx = $CenterContainer/VBoxContainer/HBoxContainer/SFX


func _init():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _ready():
	sfx.on_value_changed_callback = Callable(self, "_on_value_changed_callback")
	sfx.find_child("Slider").grab_focus()

func _on_value_changed_callback(value: float) -> void:
	AudioPlayer.play_sound("non_movement")

func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)

