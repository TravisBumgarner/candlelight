extends Control

@onready var save_buttons_container = $SaveButtonsContainer
@onready var new_game_button = $TextureRect/NewGame
@onready var game_scene = load("res://Game/game_board.tscn")



var save_files = []  # Store the list of available saves

# Called when the node enters the scene tree
func _ready():
	# Scan for save files in the user:// directory
	check_for_saves()

# Function to check for save files and create buttons dynamically
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
			create_save_button(full_file_path)
		file_name = dir.get_next()
		full_file_path = "%s/%s" % [game_save_dir, file_name]
	
	dir.list_dir_end()

# Function to create a button for each save file
func create_save_button(file_name: String):
	var button = Button.new()
	button.text = "Play " + file_name
	button.name = file_name
	button.connect("pressed", Callable(self, "_on_save_button_pressed").bind(file_name))
	
	# Add the button to a container (e.g., a VBoxContainer or Panel)
	save_buttons_container.add_child(button)

# Function to handle button press, loading the save file
func _on_save_button_pressed(file_name: String):
	print("Loading save:", file_name)
	load_game(file_name)

# Function to load the game based on the selected save file
func load_game(file_name: String):
	if not FileAccess.file_exists(file_name):
		print("Error: Save file not found.")
		return
	
	var file = FileAccess.open(file_name, FileAccess.READ)
	var save_data = file.get_as_text()  # Assuming the save is in a readable format (e.g., JSON)
	file.close()
	
		# Create an instance of the JSON class and parse the text
	var parse_result = JSON.parse_string(save_data)
	
	if not parse_result is Dictionary:
		print("Failed to parse saved game data")
		return null

	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	GlobalState.game_save_data = parse_result
	get_tree().change_scene_to_packed(game_scene)	


func _on_new_game_pressed():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	get_tree().change_scene_to_packed(game_scene)
