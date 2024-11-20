extends Control

@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput
@onready var save_buttons_container = $SavesPositioningContainer/VBoxContainer/SaveButtonsContainer
@onready var levels_positioning_container = $LevelsPositioningContainer
@onready var saves_positioning_container = $SavesPositioningContainer
@onready var level_buttons_container = $LevelsPositioningContainer/VBoxContainer/ScrollContainer/LevelButtonsContainer



@onready var game_scene = load("res://GameBase/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

func _ready():
	save_buttons_container.get_child(0).grab_focus()
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))
	check_for_saves()

func create_level_button(file_name: String, world_number: int, level_number: int, disabled: bool, best_score: int):
	var button = Button.new()
	var text = "Level " + str(level_number) + '\n'
	if best_score > 0: # If undefined, Top Score is -1
		text+= "Best: %d" % [best_score]
	
	button.text = text
	button.disabled = disabled
	button.name = file_name
	button.theme = candlelight_theme
	button.connect("pressed", Callable(self, "_on_level_button_pressed").bind(world_number, level_number))
	level_buttons_container.add_child(button)

func _on_level_button_pressed(world_number, level_number):
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Puzzle
	GlobalState.puzzle_mode_level = {"level_number": level_number, "world_number": world_number}
	get_tree().change_scene_to_packed(game_scene)

func _on_action_pressed(action):
	match action:
		"escape":
			var game_saves_displayed = saves_positioning_container.visible
			# Return to main menu, otherwise return to saves.
			if game_saves_displayed:
				cleanup()
			else:
				levels_positioning_container.hide()
				saves_positioning_container.show()
				save_buttons_container.get_child(0).grab_focus()
				

func cleanup():
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))
	get_tree().change_scene_to_packed(main_menu)


func check_for_saves():
	var game_saves_path = "user://game_saves/%s" % [GlobalConsts.GAME_MODE.Puzzle]
	DirAccess.make_dir_recursive_absolute(game_saves_path)
	
	for save_slot in GlobalConsts.GAME_SLOTS:
		var absolute_file_path = "%s/%s.save" % [game_saves_path, save_slot]
		if not FileAccess.file_exists(absolute_file_path):
			continue
			
		var config = ConfigFile.new()
		config.load(absolute_file_path)
		var current_max_level_available = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_LEVEL_NUMBER, 1)
		var levels_complete = current_max_level_available - 1
		# Todo - this calculation doesn't account for multiple worlds		 
		var button = save_buttons_container.find_child('Save%sButton' % [save_slot])

		var text = "Save %s\n" % [save_slot]
		text += "%d Completed Level" % [levels_complete]
		if levels_complete != 1:
			text += 's'
		
		button.text = text


func handle_save_press(save_slot: String):
	var config = ConfigFile.new()
	var game_saves_path = "user://game_saves/%s/%s.save" % [GlobalConsts.GAME_MODE.Puzzle, save_slot]
	config.load(game_saves_path)
	var max_available_world_number = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_WORLD_NUMBER, 1)
	var max_available_level_number = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.PUZZLE_SAVE_METADATA.MAX_AVAILABLE_LEVEL_NUMBER, 1)
	
	saves_positioning_container.hide()
	levels_positioning_container.show()
	GlobalState.save_slot = save_slot
	
	Utilities.remove_all_children(level_buttons_container)
	
	var worlds = PuzzleModeLevelManager.get_worlds_metadata()
	
	for world_metadata in worlds.values():
		print(world_metadata)
		create_world_label(world_metadata['world_name'], world_metadata['world_number'])
		for level_metadata in world_metadata['levels']:
			var disabled
			
			if world_metadata['world_number'] < max_available_world_number:
				# Past worlds: Enable all levels
				disabled = false
			elif world_metadata['world_number'] == max_available_world_number:
				# Current world: Enable levels up to max_available_level_number
				disabled = level_metadata['level_number'] > max_available_level_number
			else:
				# Future worlds: Disable everything
				disabled = true
						
			
			var best_score = config.get_value(GlobalConsts.GAME_SAVE_SECTIONS.PuzzleLevelScores, 'level%s' % [level_metadata['level_number']], -1)
			create_level_button(level_metadata['file_name'], world_metadata['world_number'], level_metadata['level_number'], disabled, best_score)
	# 0th child is always a label
	level_buttons_container.get_child(1).grab_focus()
	
	
func create_world_label(world_name: String, world_number: int):
	var label = Label.new()
	label.text = "World %d: %s" % [world_number, world_name]
	label.horizontal_alignment = 1 # center
	level_buttons_container.add_child(label)


func _on_save_a_button_pressed():
	handle_save_press('a')


func _on_save_b_button_pressed():
	handle_save_press('b')


func _on_save_c_button_pressed():
	handle_save_press('c')


func _on_save_d_button_pressed():
	handle_save_press('d')
