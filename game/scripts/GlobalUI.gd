extends Node2D

var sounds
@onready var reset_2 = $Reset2

signal reset_game

func _ready():
	sounds = $Sounds  # Adjust the path to your actual Sounds node
	SoundManager.connect("play_sound", sounds.play_sound)

func _on_one_gem_finished():
	pass # Replace with function body.



func _on_main_menu_pressed():
	get_tree().change_scene_to_file('res://scenes/menus/main_menu.tscn')




func _on_reset_2_button_up():
	emit_signal('reset_game')
	# can't ifgure out why the button remains pressed
	reset_2.release_focus()

	
