extends Control

func _process(_delta):
	# Comment out the next line to show the main menu.
	#get_tree().change_scene_to_file('res://scenes/mode_puzzle/puzzle_game.tscn')
	pass


func _on_options_pressed():
	get_tree().change_scene_to_file('res://scenes/menus/options_menu.tscn')


func _on_quit_pressed():
	get_tree().quit()


func _on_chaos_button_pressed():
	pass # Replace with function body.


func _on_daily_button_pressed():
	get_tree().change_scene_to_file('res://scenes/mode_daily/daily_game.tscn')


func _on_puzzle_button_pressed():
	get_tree().change_scene_to_file('res://scenes/mode_puzzle/puzzle_game.tscn')


func _on_speed_button_pressed():
	pass # Replace with function body.
