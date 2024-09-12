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
@onready var submit_score = $SubmitScore

const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

func return_to_main_menu():
	get_tree().change_scene_to_packed(self.main_menu_scene)

var game 

func create_game(game_mode, show_submit_score: bool) -> void:
	game = game_mode.new([
		# ALPHABETICAL
		board_tile_map, 
		game_details_label, 
		game_details_tile_map,
		game_details_value,
		instructions,
		level_complete_timer, 
		queue_tile_map, 
		Callable(self, "return_to_main_menu"),
		sounds, 
		target_gem_tile_map
		# ALPHABETICAL
	])
	if show_submit_score:
		submit_score.show()
	else:
		submit_score.hide()

func _ready():
	var game_modes = {
		GlobalConsts.GAME_MODE.ApprenticeshipGame: { "class": ApprenticeshipGame, "show_score": false },
		GlobalConsts.GAME_MODE.PuzzleGame: { "class": PuzzleGame, "show_score": true },
		GlobalConsts.GAME_MODE.DailyGame: { "class": DailyGame, "show_score": false }
	}
	
	if GlobalState.game_mode in game_modes:
		var selected_game = game_modes[GlobalState.game_mode]
		create_game(selected_game["class"], selected_game["show_score"])
		
	if GlobalState.game_save_file:
		game.load_game()
		GlobalState.game_save_file = null
	else:
		game.new_game()


