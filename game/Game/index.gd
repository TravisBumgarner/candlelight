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
@onready var submit_score_button = $SubmitScore

const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

func return_to_main_menu():
	get_tree().change_scene_to_packed(self.main_menu_scene)

var game 

func create_game(game_mode, track_high_scores: bool) -> void:
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
		submit_score_button, 
		target_gem_tile_map
		# ALPHABETICAL
	])
	if track_high_scores:
		submit_score_button.show()
	else:
		submit_score_button.hide()

func sort_ascending(a, b):
	if a['foo'] < b['foo']:
		return true
	return false


func _ready():
	var my_items = [{"foo":5}, {"foo": 2}, {"foo": 3}]
	my_items.sort_custom(sort_ascending)
	print(my_items) # Prints [[4, Tomato], [5, Potato], [9, Rice]].
	
	print('hellllo?')
	
	var game_modes = {
		GlobalConsts.GAME_MODE.ApprenticeshipGame: { "class": ApprenticeshipGame, "track_high_scores": false },
		GlobalConsts.GAME_MODE.PuzzleGame: { "class": PuzzleGame, "track_high_scores": true },
		GlobalConsts.GAME_MODE.DailyGame: { "class": DailyGame, "track_high_scores": false }
	}
	
	if GlobalState.game_mode in game_modes:
		var selected_game = game_modes[GlobalState.game_mode]
		create_game(selected_game["class"], selected_game["track_high_scores"])
		
	if GlobalState.game_save_file:
		game.load_game()
		GlobalState.game_save_file = null
	else:
		game.new_game()


