extends Control


@onready var new_game_button = $NewGameContainer/NewGameSubContainer/NewGameButton
@onready var saves_positioning_container = $SavesPositioningContainer

@onready var high_scores_container = $HighScoresContainer
@onready var save_buttons_container = $SavesPositioningContainer/VBoxContainer/SaveButtonsContainer

@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

func _ready():
	save_buttons_container.get_child(0).grab_focus()
	check_for_saves()
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func check_for_saves():
	var game_saves_path = "user://game_saves/%s" % [GlobalConsts.GAME_MODE.Daily]
	DirAccess.make_dir_recursive_absolute(game_saves_path)
	var dir = DirAccess.open(game_saves_path)
	
	for save_slot in GlobalConsts.GAME_SLOTS:
		var absolute_file_path = "%s/%s.save" % [game_saves_path, save_slot]
		if not FileAccess.file_exists(absolute_file_path):
			continue
			
		var config = ConfigFile.new()
		config.load(absolute_file_path)
		var best_scores = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.DAILY_SAVE_METADATA.BEST_SCORES)
		
		var button = save_buttons_container.find_child('Save%sButton' % [save_slot])

		var text = "Save %s\n" % [save_slot]
		var day_text = "Day" if len(best_scores) == 1 else "Days"
		text += "%d %s Completed" % [len(best_scores), day_text]
		
		button.text = text
	

func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)

func handle_save_press(save_slot: String):
	GlobalState.save_slot = save_slot
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Daily
	get_tree().change_scene_to_packed(game_scene)
	

func _on_save_a_button_pressed():
	handle_save_press('a')


func _on_save_b_button_pressed():
	handle_save_press('b')


func _on_save_c_button_pressed():
	handle_save_press('c')


func _on_save_d_button_pressed():
	handle_save_press('d')

