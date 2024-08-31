extends Node2D

@onready var board_tile_map = $BoardTileMap
@onready var target_gem_tile_map = $TargetGemTileMap
@onready var queue_tile_map = $QueueTileMap
@onready var level_complete_timer = $LevelCompleteTimer
@onready var sounds = $Sounds
@onready var game_details_label = $GameDetailsTileMap/GameDetailsLabel
@onready var game_details_value = $GameDetailsTileMap/GameDetailsValue
@onready var instructions = $Instructions
const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

func hello():
	get_tree().change_scene_to_packed(self.main_menu_scene)

var game
#var hello = 5
#func hello():
	#print('hello')
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
		instructions,
		Callable(self, "hello")
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
		instructions,
		Callable(self, "hello")
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
		instructions,
		Callable(self, "hello")
	)
	
	game.new_game()
	
	
	

