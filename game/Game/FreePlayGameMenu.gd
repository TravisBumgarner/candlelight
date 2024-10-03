extends Control
@onready var save_buttons_container = $SavesPositioningContainer/VBoxContainer/SaveButtonsContainer

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

var save_files = []

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	check_for_saves()
	save_buttons_container.get_child(0).grab_focus()

func check_for_saves():
	var game_saves_path = "user://game_saves/%s" % [GlobalConsts.GAME_MODE.FreePlay]
	DirAccess.make_dir_recursive_absolute(game_saves_path)
	
	for save_slot in GlobalConsts.GAME_SLOTS:
		var absolute_file_path = "%s/%s.save" % [game_saves_path, save_slot]
		if not FileAccess.file_exists(absolute_file_path):
			continue
			
		var config = ConfigFile.new()
		config.load(absolute_file_path)
		var alchemizations = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.ALCHEMIZATIONS)
		var level = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.FREE_PLAY_SAVE_METADATA.LEVEL)
		
		var button = save_buttons_container.find_child('Save%sButton' % [save_slot])

		var text = "Save %s\n" % [save_slot]
		text += "Level %d" % [level] # Need to rethink alchemizations
		
		button.text = text

func _on_back_button_pressed():
	get_tree().change_scene_to_packed(main_menu)

		
func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)



func handle_save_press(save_slot: String):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.FreePlay
	GlobalState.save_slot = save_slot
	get_tree().change_scene_to_packed(game_scene)

func _on_save_a_button_pressed():
	handle_save_press('a')


func _on_save_b_button_pressed():
	handle_save_press('b')


func _on_save_c_button_pressed():
	handle_save_press('c')


func _on_save_d_button_pressed():
	handle_save_press('d')
