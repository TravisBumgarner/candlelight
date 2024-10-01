extends Control


@onready var new_game_button = $NewGameContainer/NewGameSubContainer/NewGameButton
@onready var high_scores_container = $HighScoresScrollContainer/HighScoresContainer
@onready var game_saves_container = $GameSavesScrollContainer/GameSavesContainer
@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

var save_files = []

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	check_for_saves()
	populate_high_scores()

func populate_high_scores():
	for score in FreePlayModeHighScores.high_scores:
		var label = Label.new()
		label.text = "Level: %d, Alchemizations: %d" % [score["level"], score["alchemizations"]]
		high_scores_container.add_child(label)

func check_for_saves():
	var game_save_dir = Utilities.get_save_game_dir(GlobalConsts.GAME_SAVE_KEYS.FREE_PLAY_GAME)
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
			var player_name = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.PLAYER_NAME)
			var alchemizations = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.ALCHEMIZATIONS)
			var level = config.get_value(GlobalConsts.CONFIG_FILE_SAVE_KEY, GlobalConsts.FREE_PLAY_GAME_SAVE_KEY.LEVEL)
			create_save_button(full_file_path, player_name, level, alchemizations)
		file_name = dir.get_next()
		full_file_path = "%s/%s" % [game_save_dir, file_name]
		
	dir.list_dir_end()
	var children = game_saves_container.get_children()
	# Focus first child that is a button. Best I could come up with. 
	for child in children:
		if child is Button:
			child.grab_focus()
			break


# Function to create a button for each save file
func create_save_button(file_name: String, player_name: String, level: int, alchemizations: int):
	var button = Button.new()
	var text = player_name + '\n'
	text += "Level " + str(level) + '\n'
	text += str(alchemizations) + " Alchemiations"
	
	button.text = text
	button.name = file_name
	button.theme = candlelight_theme
	button.connect("pressed", Callable(self, "_on_save_button_pressed").bind(file_name))
	
	# Add the button to a container (e.g., a VBoxContainer or Panel)
	game_saves_container.add_child(button)

# Function to handle button press, loading the save file
func _on_save_button_pressed(file_name: String):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.FreePlayGame
	GlobalState.game_save_file = file_name
	get_tree().change_scene_to_packed(game_scene)

func _on_new_game_pressed():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.FreePlayGame
	get_tree().change_scene_to_packed(game_scene)


func _on_back_button_pressed():
	get_tree().change_scene_to_packed(main_menu)


func _on_name_input_text_changed(new_text):
	GlobalState.player_name = new_text
	var submit_disabled = len(new_text) == 0
	new_game_button.disabled = submit_disabled
		
func _on_action_pressed(action):
	match action:
		"escape":
			print('main menu e')
			cleanup()

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)
