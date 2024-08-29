extends Node2D

@onready var board_tile_map = $BoardTileMap
@onready var target_gem_tile_map = $TargetGemTileMap
@onready var queue_tile_map = $QueueTileMap
@onready var level_complete_timer = $LevelCompleteTimer
@onready var sounds = $Sounds
@onready var game_details_label = $GameDetailsTileMap/GameDetailsLabel
@onready var game_details_value = $GameDetailsTileMap/GameDetailsValue

func _ready():
	var base_game = BaseGame.new(
		board_tile_map, 
		target_gem_tile_map, 
		queue_tile_map, 
		level_complete_timer, 
		sounds, 
		game_details_label, 
		game_details_value
	)
	base_game.new_game()
