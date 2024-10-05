extends Control

@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput
@onready var save_buttons_container = $SavesPositioningContainer/VBoxContainer/SaveButtonsContainer
@onready var level_buttons_container = $LevelsPositioningContainer/VBoxContainer/LevelButtonsContainer
@onready var levels_positioning_container = $LevelsPositioningContainer
@onready var saves_positioning_container = $SavesPositioningContainer

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")
const level_designer = preload("res://LevelDesigner/index.tscn")

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	check_for_levels()

func create_level_button(file_name: String, level: int, disabled: bool, best_score: int):
	var button = Button.new()
	var text = "Level " + str(level) + '\n'
	if best_score > 0: # If undefined, Top Score is -1
		text+= "Top Score: %d" % [best_score]
	
	button.text = text
	button.disabled = disabled
	button.name = file_name
	button.theme = candlelight_theme
	button.connect("pressed", Callable(self, "_on_level_button_pressed").bind(level))
	level_buttons_container.add_child(button)

func _on_level_button_pressed(level):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Puzzle
	GlobalState.puzzle_mode_level = level
	get_tree().change_scene_to_packed(game_scene)

func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()


func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)


func check_for_levels():
	var levels_path = "user://user_created_levels"
	DirAccess.make_dir_recursive_absolute(levels_path)
	
	var dir = DirAccess.open(levels_path)
	if dir == null:
		print("Cannot open directory: ", levels_path)
		return

	dir.list_dir_begin()
	var file_name = dir.get_next()

	while file_name != "":
		# Check if the file ends with .level
		if file_name.ends_with(".level"):
			var absolute_file_path = "%s/%s" % [levels_path, file_name]
			print('abs', absolute_file_path)

			if not FileAccess.file_exists(absolute_file_path):
				file_name = dir.get_next()
				continue

			var config = ConfigFile.new()
			config.load(absolute_file_path)
			var name = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.LEVEL_DESIGNER_METADATA.NAME)
			
			var button = Button.new()
			var text = "Level: " % [name]
			button.text = text
			level_buttons_container.add_child(button)
		
		file_name = dir.get_next()

	dir.list_dir_end()

func _on_new_level_button_pressed():
	get_tree().change_scene_to_packed(level_designer)
