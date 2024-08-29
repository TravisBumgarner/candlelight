extends Control
class_name MainMenu

@onready var daily_game_button = $Daily/DailyGame
@onready var puzzle_game_button = $PuzzleGame/PuzzleGame
@onready var exit = $Exit/Exit

@onready var puzzle_game = preload("res://game.tscn")
@onready var daily_game = preload("res://game.tscn")

func _ready():
	daily_game_button.connect("pressed", Callable(self, "on_daily_game_button_down"))
	puzzle_game_button.connect("pressed", Callable(self, "on_puzzle_game_button_down"))
	exit.connect("pressed", Callable(self, "on_exit_button_down"))

func on_daily_game_button_down():
	get_tree().change_scene_to_packed(puzzle_game)
	
func on_puzzle_game_button_down():
	get_tree().change_scene_to_packed(daily_game)
	
func on_exit_button_down():
	print('called')
	get_tree().quit()
