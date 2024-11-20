extends Control
class_name MainMenu

@onready var puzzle_mode_button = $VBoxContainer/PuzzleModeButton
@onready var daily_game_button = $VBoxContainer/DailyGameButton
@onready var tutorial_button = $VBoxContainer/TutorialButton
@onready var level_designer_button = $VBoxContainer/LevelDesignerButton
@onready var credits_button = $VBoxContainer/CreditsButton
@onready var exit_button = $VBoxContainer/ExitButton
@onready var shared_label = $VBoxContainer/SharedLabel
@onready var free_play_game_button = $VBoxContainer/FreePlayGameButton

@onready var game_scene = load("res://GameBase/game_board.tscn")
@onready var puzzle_game_menu = load("res://GamePuzzle/PuzzleGameMenu.tscn")
@onready var credits_scene = load("res://Credits/credits.tscn")
#@onready var create_challenge_scene = load("res://CreateChallenge/index.tscn")
@onready var free_play_game_menu = load("res://GameFreePlay/FreePlayGameMenu.tscn")
@onready var daily_game_menu = load("res://GameDaily/DailyGameMenu.tscn")
@onready var level_designer_menu = load("res://LeveDesigner/LevelDesignerMenu.tscn")

const HELPER_TEXT_DICT = {
	"PuzzleModeButton": "Solve the puzzle with the fewest moves.",
	"FreePlayGameButton": "Unwind and play at your own pace.",
	"DailyGameButton": "Compete with friends to solve the daily challenge.",
	"TutorialButton": "Master the game’s basics.",
	"LevelDesignerButton": "Build your own levels.",
	"CreditsButton": "Meet the creators behind the game.",
	"ExitButton": "Thanks for playing! See you soon!"
}

func _ready():
	MusicPlayer.play_intro_music()
	puzzle_mode_button.connect("pressed", Callable(self, "on_puzzle_mode_button_down"))
	daily_game_button.connect("pressed", Callable(self, "on_daily_game_button_down"))
	free_play_game_button.connect("pressed", Callable(self, "on_free_play_game_button_down"))
	tutorial_button.connect("pressed", Callable(self, "on_tutorial_button_down"))
	level_designer_button.connect("pressed", Callable(self, "on_level_designer_button_down"))
	exit_button.connect("pressed", Callable(self, "on_exit_button_down"))
	credits_button.connect("pressed", Callable(self, "on_credits_button_down"))
	get_viewport().connect("gui_focus_changed", Callable(self, "_on_focus_changed"))

	puzzle_mode_button.grab_focus()
	
func on_tutorial_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Tutorial
	get_tree().change_scene_to_packed(game_scene)
	
func on_puzzle_mode_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Puzzle
	get_tree().change_scene_to_packed(puzzle_game_menu)
	
func on_daily_game_button_down():
	get_tree().change_scene_to_packed(daily_game_menu)
	
func on_free_play_game_button_down():
	get_tree().change_scene_to_packed(free_play_game_menu)

func on_level_designer_button_down():
	get_tree().change_scene_to_packed(level_designer_menu)

func on_exit_button_down():
	get_tree().quit()
	
func on_credits_button_down():
	get_tree().change_scene_to_packed(credits_scene)

func _on_focus_changed(control:Control) -> void:
	if control != null:
		shared_label.text = HELPER_TEXT_DICT[control.name]
