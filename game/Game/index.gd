extends Node2D

@onready var board_tile_map = $BoardTileMap
@onready var target_gem_tile_map = $TargetGemTileMap
@onready var queue_tile_map = $QueueTileMap
@onready var level_complete_timer = $LevelCompleteTimer
@onready var sounds = $Sounds
@onready var game_details_label = $GameDetailsTileMap/GameDetailsLabel
@onready var game_details_value = $GameDetailsTileMap/Control/VBoxContainer/GameDetailsValue
@onready var instructions = $Instructions

@onready var game_details_tile_map = $GameDetailsTileMap
@onready var new_game_button = $NewGameButton
@onready var pause_menu_container = $PauseMenuContainer
@onready var resume_button = $PauseMenuContainer/PanelContainer/VBoxContainer/ResumeButton


@onready var puzzle_complete_hbox_container = $PuzzleGameLevelComplete

const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

var game: BaseGame

func create_game(
	game_mode,
	show_instructions: bool,
	show_new_game_button: bool
) -> void:
	game = game_mode.new([
		# ALPHABETICAL
		board_tile_map, 
		game_details_label, 
		game_details_tile_map,
		game_details_value,
		instructions,
		level_complete_timer,
		pause_menu_container,
		puzzle_complete_hbox_container,
		queue_tile_map, 
		sounds,
		target_gem_tile_map
		# ALPHABETICAL
	])
	
	# Will never be visible on game start.
	# The PuzzleGame is responsible for controlling visibility.
	puzzle_complete_hbox_container.hide()
	
	if show_instructions:
		instructions.show()
	else:
		instructions.hide()
		
	if show_new_game_button:
		new_game_button.show()
	else:
		new_game_button.hide()

func _ready():	
	var game_modes = {
		GlobalConsts.GAME_MODE.TutorialMode: {
			"class": TutorialMode,
			"show_instructions": true,
			"show_new_game_button": false
		},
		GlobalConsts.GAME_MODE.FreePlayGame: {
			"class": FreePlayGame,
			"show_instructions": false,
			"show_new_game_button": false
		},
		# Setting track_high_scores to false for the time being.
		GlobalConsts.GAME_MODE.DailyGame: {
			"class": DailyGame, 
			"show_instructions": false,
			"show_new_game_button": true
		},
			GlobalConsts.GAME_MODE.PuzzleGame: {
			"class": PuzzleGame, 
			"show_instructions": false,
			"show_new_game_button": false
		}
	}
	
	if GlobalState.game_mode in game_modes:
		var selected_game = game_modes[GlobalState.game_mode]
		create_game(
			selected_game["class"],
			selected_game['show_instructions'],
			selected_game['show_new_game_button']
		)
		
	if GlobalState.puzzle_mode_level != null:
		# I don't think we can pass the level from the PuzzleGameMenu
		# So I think this is the next best thing
		game.level = GlobalState.puzzle_mode_level
		GlobalState.puzzle_mode_level = null
	
	if GlobalState.game_save_file:
		game.load_game()
		GlobalState.game_save_file = null
	else:
		game.new_game()

func _on_new_game_button_pressed():
	self.game.new_game()

func _on_next_level_pressed():
	self.game.level += 1
	self.game.new_game()
	

func _on_try_again_pressed():
	self.game.new_game()

func _on_resume_button_pressed():
	game.resume() # Cannot figure out how to use built in get_tree().pause
	pause_menu_container.hide()

func _on_main_menu_button_pressed():
	self.game.cleanup()
	get_tree().change_scene_to_packed(self.main_menu_scene)

func _on_pause_menu_container_visibility_changed():
	if is_visible_in_tree():
		#get_tree().paused = true
		resume_button.grab_focus()

