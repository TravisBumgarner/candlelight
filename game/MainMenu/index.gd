extends Control
class_name MainMenu
@onready var free_play_game_button = $VBoxContainer/FreePlayGame/FreePlayGameButton
@onready var tutorial_button = $VBoxContainer/Tutorial/TutorialButton
@onready var daily_game_button = $VBoxContainer/Daily/DailyGameButton
@onready var puzzle_mode_button = $"VBoxContainer/Puzzle Mode/PuzzleModeButton"
@onready var play_challenge_button = $VBoxContainer/PlayerGenerated/PlayChallengeButton
@onready var credits_button = $VBoxContainer/Misc/CreditsButton
@onready var exit_button = $VBoxContainer/Misc/ExitButton

@onready var game_scene = load("res://Game/game_board.tscn")
@onready var puzzle_game_menu = preload("res://Game/PuzzleGameMenu.tscn")
@onready var credits_scene = load("res://Credits/credits.tscn")
@onready var create_challenge_scene = load("res://CreateChallenge/index.tscn")
@onready var free_play_game_menu = load("res://Game/FreePlayGameMenu.tscn")
@onready var daily_game_menu = load("res://Game/DailyGameMenu.tscn")

func _ready():
	puzzle_mode_button.connect("pressed", Callable(self, "on_puzzle_mode_button_down"))
	daily_game_button.connect("pressed", Callable(self, "on_daily_game_button_down"))
	free_play_game_button.connect("pressed", Callable(self, "on_free_play_game_button_down"))
	tutorial_button.connect("pressed", Callable(self, "on_tutorial_button_down"))
	play_challenge_button.connect("pressed", Callable(self, "on_play_challenge_button_down"))
	exit_button.connect("pressed", Callable(self, "on_exit_button_down"))
	credits_button.connect("pressed", Callable(self, "on_credits_button_down"))

func on_tutorial_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.TutorialMode
	get_tree().change_scene_to_packed(game_scene)
	
func on_puzzle_mode_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.PuzzleGame
	get_tree().change_scene_to_packed(puzzle_game_menu)
	
func on_daily_game_button_down():
	get_tree().change_scene_to_packed(daily_game_menu)
	
func on_free_play_game_button_down():
	get_tree().change_scene_to_packed(free_play_game_menu)

func on_play_challenge_button_down():
	get_tree().change_scene_to_packed(create_challenge_scene)

func on_exit_button_down():
	get_tree().quit()
	
func on_credits_button_down():
	get_tree().change_scene_to_packed(credits_scene)
