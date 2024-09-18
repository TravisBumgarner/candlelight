extends Control


@onready var new_game_button = $NewGameContainer/NewGameSubContainer/NewGameButton


@onready var high_scores_container = $HighScoresContainer


@onready var name_input = $NewGameContainer/NewGameSubContainer/NameInput

@onready var game_scene = load("res://Game/game_board.tscn")
const main_menu = preload("res://MainMenu/main_menu.tscn")
const candlelight_theme = preload("res://candlelight_theme.tres")

func _ready():
	populate_high_scores()


func populate_high_scores():
	var current_date = null
	var scores_for_date = 0
	
	var high_score_dates = DailyModeHighScores.high_scores.keys()
	high_score_dates.sort_custom(func(a, b): return a.naturalnocasecmp_to(b) > 0)
	
	for date in high_score_dates:
		var date_label = Label.new()
		date_label.text = date
		high_scores_container.add_child(date_label)
		
		var high_scores = DailyModeHighScores.high_scores[date]
		
		scores_for_date = 0
		for high_score in high_scores:
			if scores_for_date == 3:
				break
			
			var label = Label.new()
			label.text = "Bob - %d" % [high_score["alchemizations"]]
			high_scores_container.add_child(label)
			scores_for_date += 1

func _on_new_game_pressed():
	GlobalState.game_mode = GlobalConsts.GAME_MODE.DailyGame
	get_tree().change_scene_to_packed(game_scene)

func _on_back_button_pressed():
	get_tree().change_scene_to_packed(main_menu)

func _on_name_input_text_changed(new_text):
	GlobalState.player_name = new_text
	var submit_disabled = len(new_text) == 0
	new_game_button.disabled = submit_disabled
