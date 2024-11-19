extends Node2D

@onready var board_tile_map = $BoardTileMap
@onready var target_gem_control = $TargetGemControl
@onready var queue_control = $QueueControl
@onready var level_complete_timer = $LevelCompleteTimer
@onready var game_over_timer = $GameOverTimer
@onready var sounds = $Sounds

@onready var game_details_label = $GameDetailsControl/GameDetailsTileMap/GameDetailsLabel
@onready var game_details_value = $GameDetailsControl/GameDetailsTileMap/Control/VBoxContainer/GameDetailsValue
@onready var instructions = $Instructions
@onready var resume_button = $PauseMenuContainer/PanelContainer/HBoxContainer/ControlsContainer/ResumeButton
@onready var game_details_control = $GameDetailsControl
@onready var pause_menu_container = $PauseMenuContainer
@onready var level_complete_controls_h_box_container = $LevelCompleteControllsCenterContainer/LevelCompleteControlsHBoxContainer
@onready var return_to_level_editor_button = $PauseMenuContainer/PanelContainer/HBoxContainer/ControlsContainer/ReturnToLevelEditorButton
@onready var level_designer = preload("res://LevelDesigner/index.tscn")


const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

var game: BaseGame

func create_game(
	game_mode,
) -> void:
	game = game_mode.new([
		# ALPHABETICAL
		board_tile_map, 
		game_details_label, 
		game_details_control,
		game_details_value,
		game_over_timer,
		instructions,
		level_complete_controls_h_box_container,
		level_complete_timer,
		pause_menu_container,
		queue_control, 
		sounds,
		target_gem_control
		# ALPHABETICAL
	])

func _ready():
	# Hide overlapping UI Controls.
	# Doing this programmaticaly makes it easier eveywhere.
	instructions.hide()
	level_complete_controls_h_box_container.hide()
	
	var game_modes = {
		GlobalConsts.GAME_MODE.Tutorial: {
			"class": TutorialMode,
		},
		GlobalConsts.GAME_MODE.FreePlay: {
			"class": FreePlayGame,
		},
		# Setting track_high_scores to false for the time being.
		GlobalConsts.GAME_MODE.Daily: {
			"class": DailyGame, 
		},
		GlobalConsts.GAME_MODE.Puzzle: {
			"class": PuzzleGame, 
		},
		GlobalConsts.GAME_MODE.LevelDesigner: {
			"class": LevelDesignerGame, 
		}
	}
	
	if GlobalState.game_mode in game_modes:
		var selected_game = game_modes[GlobalState.game_mode]
		create_game(
			selected_game["class"],
		)
		
	if GlobalState.puzzle_mode_level != null:
		# I don't think we can pass the level from the PuzzleGameMenu
		# So I think this is the next best thing
		game.level_number = GlobalState.puzzle_mode_level['level_number']
		game.world_number = GlobalState.puzzle_mode_level['world_number']
		GlobalState.puzzle_mode_level = null
	
	var game_save_path = "user://game_saves/%s/%s.save" % [GlobalState.game_mode, GlobalState.save_slot]
	if FileAccess.file_exists(game_save_path):
		game.load_game()
	else:
		game.new_game()
	
func _on_resume_button_pressed():
	game.resume() # Cannot figure out how to use built in get_tree().pause
	pause_menu_container.hide()

func _on_main_menu_button_pressed():
	self.game.cleanup()
	get_tree().change_scene_to_packed(self.main_menu_scene)

func _on_pause_menu_container_visibility_changed():
	# For some reason this line will error if PuzzleMenuContainer on _ready
	if is_visible_in_tree():
		resume_button.grab_focus()
		
	if GlobalState.game_mode == GlobalConsts.GAME_MODE.LevelDesigner:
		return_to_level_editor_button.show()
	else:
		return_to_level_editor_button.hide()

func _on_restart_button_pressed():
	self.game.new_game()
	

func _on_next_level_button_pressed():
	if GlobalState.game_mode == GlobalConsts.GAME_MODE.Puzzle:
		var next_level = PuzzleModeLevelManager.get_next_world_and_level_number(self.game.world_number, self.game.level_number)
		self.game.level_number = next_level['level_number']
		self.game.world_number = next_level['world_number']
	else:
		self.game.level_number += 1
	self.game.new_game()


func _on_return_to_level_editor_button_pressed():
	self.game.cleanup()
	get_tree().change_scene_to_packed(level_designer)
