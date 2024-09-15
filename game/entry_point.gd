extends Node

@onready var main_menu = preload("res://MainMenu/main_menu.tscn")
@onready var tutorial_menu = preload("res://Tutorial/tutorial_menu.tscn")

func clear_local_data():
	KeyValueStore.clear()

func _ready():
	# Useful for debugging. 
	clear_local_data()
	
	var hasSeenApprenticeship = KeyValueStore.load_data(KeyValueStore.StoreKey.HasSeenApprenticeship)

	var scene = main_menu if hasSeenApprenticeship == 'true' else tutorial_menu
	
	# Use call_deferred to change the scene
	call_deferred("_change_scene", scene)
	KeyValueStore.save_data(KeyValueStore.StoreKey.HasSeenApprenticeship, 'true')

func _change_scene(scene):
	get_tree().change_scene_to_packed(scene)
