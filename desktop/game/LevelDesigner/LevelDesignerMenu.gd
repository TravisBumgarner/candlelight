extends Control

@onready var save_buttons_container = $SavesPositioningContainer/VBoxContainer/SaveButtonsContainer
@onready var level_buttons_container = $LevelsPositioningContainer/VBoxContainer/ScrollContainer/LevelButtonsContainer
@onready var new_level_button = $LevelsPositioningContainer/VBoxContainer/NewLevelButton

@onready var levels_positioning_container = $LevelsPositioningContainer
@onready var saves_positioning_container = $SavesPositioningContainer

@onready var game_scene = load("res://GameBase/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")
const level_designer_scene = preload("res://LevelDesigner/index.tscn")

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	check_for_levels()
	new_level_button.grab_focus()

func _on_level_button_pressed(level):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Puzzle
	GlobalState.puzzle_id = level  # This might be incorrect?
	get_tree().change_scene_to_packed(game_scene)

func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()


func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)


func create_level_button(absolute_file_path: String, file_name: String):
	var button = Button.new()
	
	button.text = file_name
	button.name = absolute_file_path
	button.theme = candlelight_theme
	button.clip_contents = false
	button.connect("pressed", Callable(self, "_on_level_designed_button_pressed").bind(absolute_file_path))
	level_buttons_container.add_child(button)



func check_for_levels():
	var levels_path = "user://user_created_levels"
	DirAccess.make_dir_recursive_absolute(levels_path)
	
	var dir = DirAccess.open(levels_path)
	if dir == null:
		return

	dir.list_dir_begin()
	var file_name = dir.get_next()

	while file_name != "":
		# Check if the file ends with .level
		if file_name.ends_with(".level"):
			var absolute_file_path = "%s/%s" % [levels_path, file_name]
			if not FileAccess.file_exists(absolute_file_path):
				file_name = dir.get_next()
				continue

			var config = ConfigFile.new()
			config.load(absolute_file_path)
			
			#var button = Button.new()
			#var text = "Level: " % [absolute_file_path]
			#button.text = text
			#
			#button.connect("pressed", Callable(self, "_on_level_designed_button_pressed").bind(absolute_file_path))
			#level_buttons_container.add_child(button)
			create_level_button(absolute_file_path, file_name)

		file_name = dir.get_next()
	dir.list_dir_end()
	
func _on_level_designed_button_pressed(absolute_file_path):
	GlobalState.level_designer_file_path = absolute_file_path
	get_tree().change_scene_to_packed(level_designer_scene)

func _on_new_level_button_pressed():
	GlobalState.level_designer_file_path = null
	get_tree().change_scene_to_packed(level_designer_scene)
