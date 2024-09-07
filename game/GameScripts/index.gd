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

const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

func return_to_main_menu():
	get_tree().change_scene_to_packed(self.main_menu_scene)

var game 

func _ready():
	if GlobalState.gameMode == GlobalConsts.GAME_MODE.ApprenticeshipGame:
		game = ApprenticeshipGame.new(
		board_tile_map, 
		target_gem_tile_map, 
		queue_tile_map, 
		level_complete_timer, 
		sounds, 
		game_details_label, 
		game_details_value,
		game_details_tile_map,
		instructions,
		Callable(self, "return_to_main_menu")
	)
	
	if GlobalState.gameMode == GlobalConsts.GAME_MODE.PuzzleGame:
		game = PuzzleGame.new(
		board_tile_map, 
		target_gem_tile_map, 
		queue_tile_map, 
		level_complete_timer, 
		sounds, 
		game_details_label, 
		game_details_value,
		game_details_tile_map,
		instructions,
		Callable(self, "return_to_main_menu")
	)
	
	if GlobalState.gameMode == GlobalConsts.GAME_MODE.DailyGame:
		game = DailyGame.new(
		board_tile_map, 
		target_gem_tile_map, 
		queue_tile_map, 
		level_complete_timer, 
		sounds, 
		game_details_label, 
		game_details_value,
		game_details_tile_map,
		instructions,
		Callable(self, "return_to_main_menu")
	)
	
	game.new_game()
	
	
	

