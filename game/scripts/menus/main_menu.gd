extends Control



func _on_puzzle_mode_button_up():
	get_tree().change_scene_to_file('res://scenes/puzzle_game.tscn')


func _on_speed_mode_pressed():
	pass # Replace with function body.


func _on_options_pressed():
	get_tree().change_scene_to_file('res://scenes/menus/options_menu.tscn')


func _on_quit_pressed():
	get_tree().quit()