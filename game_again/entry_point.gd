extends Node

@onready var main_menu = preload("res://MainMenu/main_menu.tscn")
@onready var apprenticeship_menu = preload("res://Apprenticeship/apprenticeship_menu.tscn")

func clear_local_data():
	KeyValueStore.clear()

func _ready():
	# Useful for debugging. 
	clear_local_data()
	
	var hasSeenApprenticeship = KeyValueStore.load_data(KeyValueStore.StoreKey.HasSeenApprenticeship)

	var scene = main_menu if hasSeenApprenticeship == 'true' else apprenticeship_menu
	get_tree().change_scene_to_packed(scene)
	KeyValueStore.save_data(KeyValueStore.StoreKey.HasSeenApprenticeship, 'true')
