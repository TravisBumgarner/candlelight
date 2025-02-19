extends Node

@onready var main_menu = preload("res://MainMenu/main_menu.tscn")
@onready var tutorial_menu = preload("res://Tutorial/tutorial_menu.tscn")

var APP_ID = 3159470 # Playtest

func _ready():
	var result = Steam.steamInit(true, APP_ID)
	print('r', result)
	var isRunning = Steam.isSteamRunning()
	
	if !isRunning:
		print('not running')
		return
		
	var result2 = Steam.getAchievement('NEW_ACHIEVEMENT_1_0')
	print(result2)
	Steam.setAchievement('NEW_ACHIEVEMENT_1_0')
	var id = Steam.getSteamID()
	print('id', id)
	var name = Steam.getFriendPersonaName(id)
	print('name', str(name))
	
	var hasSeenApprenticeship = KeyValueStore.load_data(KeyValueStore.StoreKey.HasSeenApprenticeship)

	var scene = main_menu if hasSeenApprenticeship == 'true' else tutorial_menu
	
	# Use call_deferred to change the scene
	call_deferred("_change_scene", scene)
	KeyValueStore.save_data(KeyValueStore.StoreKey.HasSeenApprenticeship, 'true')

func _change_scene(scene):
	get_tree().change_scene_to_packed(scene)
 	
