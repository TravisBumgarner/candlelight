extends Control

@onready var save_buttons_container = $SaveButtonsContainer
@onready var new_game_button = $TextureRect/NewGame
@onready var high_scores_container = $HighScoresContainer
@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")

var save_files = []

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	check_for_saves()
	populate_high_scores()

func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))


func _on_action_pressed(action):
	match action:
		"escape":
			cleanup()
			get_tree().change_scene_to_packed(main_menu)

func populate_high_scores():
	for score in PuzzleModeHighScores.high_scores:
		var label = Label.new()
		label.text = "Level: %d, Alchemizations: %d" % [score["level"], score["alchemizations"]]
		high_scores_container.add_child(label)

func check_for_saves():
	var game_save_dir = Utilities.get_save_game_dir(GlobalConsts.GAME_SAVE_KEYS.PUZZLE_GAME)
	var dir = DirAccess.open(game_save_dir)
	
	if dir == null:
		print("Error: Unable to access the save directory.")
		return
	
	dir.list_dir_begin()
	var file_name = dir.get_next()
	var full_file_path = "%s/%s" % [game_save_dir, file_name]

	
	while file_name != "":
		if full_file_path.ends_with(".save"):
			# Found a save file
			save_files.append(full_file_path)
			
			var config = ConfigFile.new()
			config.load(full_file_path)
			var human_readable_last_played = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.PUZZLE_GAME_SAVE_KEY.HUMAN_READABLE_LAST_PLAYED)
			var alchemizations = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.PUZZLE_GAME_SAVE_KEY.ALCHEMIZATIONS)
			var level = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.PUZZLE_GAME_SAVE_KEY.LEVEL)
			create_save_button(full_file_path, human_readable_last_played, level, alchemizations)
		file_name = dir.get_next()
		full_file_path = "%s/%s" % [game_save_dir, file_name]
	
	dir.list_dir_end()

# Function to create a button for each save file
func create_save_button(file_name: String, human_readable_last_played: String, level: int, alchemizations: int):
	var button = Button.new()
	var text = "Last played " + human_readable_last_played + '\n'
	text += "Level " + str(level) + '\n'
	text += "Alchemiations " + str(alchemizations)
	
	button.text = text
	button.name = file_name
	button.connect("pressed", Callable(self, "_on_save_button_pressed").bind(file_name))
	
	# Add the button to a container (e.g., a VBoxContainer or Panel)
	save_buttons_container.add_child(button)

# Function to handle button press, loading the save file
func _on_save_button_pressed(file_name: String):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	GlobalState.game_save_file = file_name
	get_tree().change_scene_to_packed(game_scene)

func _on_new_game_pressed():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	get_tree().change_scene_to_packed(game_scene)
