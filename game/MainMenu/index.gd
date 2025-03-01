extends Control
class_name MainMenu

@onready var puzzle_mode_button = $VBoxContainer/Buttons/PuzzleModeButton
@onready var free_play_game_button = $VBoxContainer/Buttons/FreePlayGameButton
@onready var daily_game_button = $VBoxContainer/Buttons/DailyGameButton
@onready var tutorial_button = $VBoxContainer/Buttons/TutorialButton
@onready var credits_button = $VBoxContainer/Buttons/CreditsButton
@onready var settings_button = $VBoxContainer/Buttons/Settings
@onready var exit_button = $VBoxContainer/Buttons/ExitButton
@onready var shared_label = $VBoxContainer/SharedLabel
@onready var buttons_container = $VBoxContainer/Buttons
@onready var buttons = buttons_container.get_children()
@onready var level_designer_button = $VBoxContainer/Buttons/LevelDesignerButton

@onready var game_scene = load("res://GameBase/game_board.tscn")
@onready var puzzle_game_menu = load("res://GamePuzzle/PuzzleGameMenu.tscn")
@onready var credits_menu = load("res://Credits/credits.tscn")
@onready var settings_menu = load("res://Settings/settings.tscn")

@onready var free_play_game_menu = load("res://GameFreePlay/FreePlayGameMenu.tscn")
@onready var daily_game_menu = load("res://GameDaily/DailyGameMenu.tscn")
@onready var level_designer_menu = load("res://LevelDesigner/LevelDesignerMenu.tscn")


const HELPER_TEXT_DICT = {
  "PuzzleModeButton": "Solve puzzles using limited shapes.",
  "FreePlayGameButton": "Unwind and play at your own pace.",
  "DailyGameButton": "Solve the daily challenge with the fewest moves.",
  "TutorialButton": "Master the game’s basics.",
  "LevelDesignerButton": "Build your own levels.",
  "Settings": "Made game adjustments.",
  "CreditsButton": "Meet the creators behind the game.",
  "ExitButton": "Thanks for playing! See you soon!"
};

func _ready():
	AudioPlayer.play_music("intro")
	puzzle_mode_button.connect("pressed", Callable(self, "on_puzzle_mode_button_down"))
	daily_game_button.connect("pressed", Callable(self, "on_daily_game_button_down"))
	free_play_game_button.connect("pressed", Callable(self, "on_free_play_game_button_down"))
	tutorial_button.connect("pressed", Callable(self, "on_tutorial_button_down"))
	level_designer_button.connect("pressed", Callable(self, "on_level_designer_button_down"))
	settings_button.connect("pressed", Callable(self, "on_settings_button_down"))
	exit_button.connect("pressed", Callable(self, "on_exit_button_down"))
	credits_button.connect("pressed", Callable(self, "on_credits_button_down"))
	get_viewport().connect("gui_focus_changed", Callable(self, "_on_focus_changed"))
	
	for button in buttons:
		button.connect("mouse_entered", Callable(self, "_on_button_hovered").bind(button))
	puzzle_mode_button.grab_focus()

func _on_button_hovered(button):
	button.grab_focus()  # Set focus on hover	

func on_tutorial_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Tutorial
	get_tree().change_scene_to_packed(game_scene)
	
func on_puzzle_mode_button_down():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.Puzzle
	get_tree().change_scene_to_packed(puzzle_game_menu)
	
func on_daily_game_button_down():
	get_tree().change_scene_to_packed(daily_game_menu)
	
func on_settings_button_down():
	get_tree().change_scene_to_packed(settings_menu)
	
func on_free_play_game_button_down():
	get_tree().change_scene_to_packed(free_play_game_menu)

func on_level_designer_button_down():
	get_tree().change_scene_to_packed(level_designer_menu)

func on_exit_button_down():
	get_tree().quit()
	
func on_credits_button_down():
	get_tree().change_scene_to_packed(credits_menu)

func _on_focus_changed(control:Control) -> void:
	if control != null:
		shared_label.text = HELPER_TEXT_DICT[control.name]
