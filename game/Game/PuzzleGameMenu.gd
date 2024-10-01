extends Control

@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput
@onready var levels_container = $ScrollContainer/LevelsContainer

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	var levels = PuzzleModeLevelManager.get_levels_metadata()
	for level in levels:
		create_level_button(level['file_name'], level['level'])

func create_level_button(file_name: String, level: int):
	var button = Button.new()
	var text = "Level " + str(level) + '\n'
	
	button.text = text
	button.name = file_name
	button.theme = candlelight_theme
	button.connect("pressed", Callable(self, "_on_level_button_pressed").bind(level))
	levels_container.add_child(button)

func _on_level_button_pressed(level):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	GlobalState.puzzle_mode_level = level
	get_tree().change_scene_to_packed(game_scene)

func _on_name_input_text_changed(new_text):
	GlobalState.player_name = new_text
	#var submit_disabled = len(new_text) == 0
	#new_game_button.disabled = submit_disabled

func _on_action_pressed(action):
	match action:
		"escape":
			print('main menu b')
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)
