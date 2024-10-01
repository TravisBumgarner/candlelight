extends Control

@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput
@onready var save_buttons_container = $SavesPositioningContainer/VBoxContainer/SaveButtonsContainer
@onready var level_buttons_container = $LevelsPositioningContainer/VBoxContainer/LevelButtonsContainer
@onready var levels_positioning_container = $LevelsPositioningContainer
@onready var saves_positioning_container = $SavesPositioningContainer


@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

func _ready():
	save_buttons_container.get_child(0).grab_focus()
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
	level_buttons_container.add_child(button)

func _on_level_button_pressed(level):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Puzzle
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


func handle_save_press(save: String):
	var config = PuzzleModeLevelManager.get_player_metadata(save)
	print(config)
	saves_positioning_container.hide()
	levels_positioning_container.show()
	level_buttons_container.get_child(0).grab_focus()
	print(save)
	

func _on_save_a_button_pressed():
	handle_save_press('a')


func _on_save_b_button_pressed():
	handle_save_press('b')


func _on_save_c_button_pressed():
	handle_save_press('c')


func _on_save_d_button_pressed():
	handle_save_press('d')
