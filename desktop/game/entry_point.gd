extends Node

@onready var main_menu = preload("res://MainMenu/main_menu.tscn")
@onready var tutorial_menu = preload("res://Tutorial/tutorial_menu.tscn")

func clear_local_data():
	KeyValueStore.clear()

func _ready():
	KeyValueStore.load_or_initialize_config()
	
	var sfx_volume = KeyValueStore.load_data(KeyValueStore.StoreKey.SFXVolume)
	var sfx_bus_index = AudioServer.get_bus_index('SFX')
	AudioServer.set_bus_volume_db(
		sfx_bus_index,
		linear_to_db(sfx_volume)
	)
	
	var music_volume = KeyValueStore.load_data(KeyValueStore.StoreKey.MusicVolume)
	var music_bus_index = AudioServer.get_bus_index('Music')
	AudioServer.set_bus_volume_db(
		music_bus_index,
		linear_to_db(music_volume)
	)
	
	

	
	var hasSeenApprenticeship = KeyValueStore.load_data(KeyValueStore.StoreKey.HasSeenApprenticeship)
	var scene = main_menu if hasSeenApprenticeship == true else tutorial_menu
	
	# Use call_deferred to change the scene
	call_deferred("_change_scene", scene)

func _change_scene(scene):
	get_tree().change_scene_to_packed(scene)
 
