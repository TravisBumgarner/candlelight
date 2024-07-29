extends Node2D

var sounds

func _ready():
	sounds = $Sounds  # Adjust the path to your actual Sounds node
	SoundManager.connect("play_sound", sounds.play_sound)

func _on_one_gem_finished():
	pass # Replace with function body.



func _on_main_menu_pressed():
	get_tree().change_scene_to_file('res://scenes/menus/main_menu.tscn')

