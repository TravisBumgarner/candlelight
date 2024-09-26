extends Control


@onready var new_game_button = $NewGameContainer/NewGameSubContainer/NewGameButton

@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

func _ready():
	pass


func _on_new_game_pressed():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	get_tree().change_scene_to_packed(game_scene)

func _on_back_button_pressed():
	get_tree().change_scene_to_packed(main_menu)

func _on_name_input_text_changed(new_text):
	GlobalState.player_name = new_text
	var submit_disabled = len(new_text) == 0
	new_game_button.disabled = submit_disabled
