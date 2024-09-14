extends Control

@onready var back_button = $BackButton
const main_menu = preload("res://MainMenu/main_menu.tscn")

func _on_back_button_pressed():
	get_tree().change_scene_to_packed(main_menu)
