extends Control
class_name MainMenu

@onready var daily_game_button = $Daily/DailyGame
@onready var puzzle_game_button = $PuzzleGame/PuzzleGame
@onready var apprenticeship_game_button = $ApprenticeshipGame/ApprenticeshipGame

@onready var exit = $Exit/Exit

@onready var game = preload("res://game.tscn")


func _ready():
	daily_game_button.connect("pressed", Callable(self, "on_daily_game_button_down"))
	puzzle_game_button.connect("pressed", Callable(self, "on_puzzle_game_button_down"))
	apprenticeship_game_button.connect("pressed", Callable(self, "on_apprenticeship_game_button_down"))
	exit.connect("pressed", Callable(self, "on_exit_button_down"))

func on_apprenticeship_game_button_down():
	GlobalState.gameMode = GlobalConsts.GAME_MODE.ApprenticeshipGame
	get_tree().change_scene_to_packed(game)
	

func on_daily_game_button_down():
	GlobalState.gameMode = GlobalConsts.GAME_MODE.DailyGame
	get_tree().change_scene_to_packed(game)
	
func on_puzzle_game_button_down():
	GlobalState.gameMode = GlobalConsts.GAME_MODE.PuzzleGame
	get_tree().change_scene_to_packed(game)
	
func on_exit_button_down():
	print('called')
	get_tree().quit()
