extends Node
@onready var controller_escape = $DisplayWelcome/VBoxContainer/EscToStart/ControllerEscape

@onready var main_menu = load("res://MainMenu/main_menu.tscn")
@onready var game_scene = load("res://GameBase/game_board.tscn")
@onready var display_input = $DisplayInput
@onready var display_welcome = $DisplayWelcome
@onready var place = $DisplayWelcome/VBoxContainer/SpaceToBegin/Select
@onready var escape = $DisplayWelcome/VBoxContainer/EscToStart/Escape



var display = "display_input"

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	AudioPlayer.play_music('intro')
	display_input.show()
	display_welcome.hide()

func _on_action_pressed(action):
	if GlobalState.last_input_type == "Keyboard":
		place.texture = preload("res://assets/keyboard/keyboard_place.tres")
		escape.texture = preload("res://assets/keyboard/keyboard_esc.tres")
	else:
		place.texture = preload("res://assets/keyboard/controller_place.tres")
		escape.texture = preload("res://assets/keyboard/controller_esc.tres")
		
	if display == "display_input":
		match action:
			"select":
				display = "display_welcome"
				display_input.hide()
				display_welcome.show()
	else:
		match action:
			"escape":
				get_tree().change_scene_to_packed(main_menu)
				KeyValueStore.save_data(KeyValueStore.StoreKey.HasSeenApprenticeship, true)
			"select":
				GlobalState.game_mode = GlobalConsts.GAME_MODE.Tutorial
				get_tree().change_scene_to_packed(game_scene)
				KeyValueStore.save_data(KeyValueStore.StoreKey.HasSeenApprenticeship, true)
