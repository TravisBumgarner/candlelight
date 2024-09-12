extends Control
class_name MainMenu

@onready var daily_game_button = $Daily/DailyGame
@onready var puzzle_game_button = $PuzzleGame/PuzzleGame
@onready var apprenticeship_game_button = $ApprenticeshipGame/ApprenticeshipGame
@onready var play_challenge_button = $PlayerGenerated/PlayChallenge
@onready var create_challenge_button = $PlayerGenerated/CreateChallenge

@onready var exit = $Exit/Exit

@onready var game_scene = preload("res://Game/game_board.tscn")
@onready var create_challenge_scene = preload("res://CreateChallenge/index.tscn")
@onready var puzzle_game_menu = preload("res://Game/PuzzleGameMenu.tscn")

func _ready():
	daily_game_button.connect("pressed", Callable(self, "on_daily_game_button_down"))
	puzzle_game_button.connect("pressed", Callable(self, "on_puzzle_game_button_down"))
	apprenticeship_game_button.connect("pressed", Callable(self, "on_apprenticeship_game_button_down"))
	create_challenge_button.connect("pressed", Callable(self, "on_create_challenge_button_down"))
	exit.connect("pressed", Callable(self, "on_exit_button_down"))

func on_apprenticeship_game_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.ApprenticeshipGame
	get_tree().change_scene_to_packed(game_scene)
	
func on_daily_game_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.DailyGame
	get_tree().change_scene_to_packed(game_scene)
	
func on_puzzle_game_button_down():
	get_tree().change_scene_to_packed(puzzle_game_menu)

func on_create_challenge_button_down():
	get_tree().change_scene_to_packed(create_challenge_scene)

func on_exit_button_down():
	get_tree().quit()
