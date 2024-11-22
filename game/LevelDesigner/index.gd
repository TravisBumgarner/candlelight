extends Node2D

@onready var check_button = $CheckButton

@onready var shapes_tile_map = $ShapesControl/ShapesTileMap
@onready var full_queue_control = $FullQueueControl
@onready var target_gem_tile_map = $TargetGemControl/TargetGemTileMap

@onready var resume_button = $PauseMenuContainer/PanelContainer/HBoxContainer/ControlsContainer/ResumeButton
@onready var background_shapes_upsert = $ShapesControl/Background
@onready var background_full_queue = $FullQueueControl/Background
@onready var background_target_gem = $TargetGemControl/Background
@onready var background_buttons = $ButtonsControl/Background
@onready var pause_menu_container = $PauseMenuContainer

@onready var test_play_button = $ButtonsControl/TestPlayButton

@onready var game_scene = load("res://Gamebase/game_board.tscn")
const main_menu_scene = preload("res://MainMenu/main_menu.tscn")

var gem_placer: GemPlacer
var full_queue: FullQueue

const SHAPES_LAYER = 1
const BACKGROUND_LAYER = 0

var selected_shape_index = 0
var selected_editor_index = 0

var background_groups
var SHAPE_UPSERT_EDITOR = 0
var TARGET_GEM_EDITOR = 1
var BUTTONS_EDITOR = 2
var disable_player_interaction = false

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

	gem_placer = GemPlacer.new(target_gem_tile_map)
	full_queue = FullQueue.new(full_queue_control)
	
	if GlobalState.level_designer_file_path:
		var level_designed = ConfigFile.new()
		level_designed.load(GlobalState.level_designer_file_path)
		var gem_points = level_designed.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.LEVEL_DESIGNER_METADATA.TARGET_GEM)
		gem_placer.load_points(gem_points)
		
		var queue_items = level_designed.get_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.LEVEL_DESIGNER_METADATA.QUEUE)
		for item in queue_items:
			full_queue.append_to_queue(item)
			
	background_groups = [
		[background_shapes_upsert, background_full_queue],
		[background_target_gem],
		[background_buttons]
	]

	draw_shapes()
	draw_selected_area()
	
func draw_selected_area():
	for background_group in background_groups:
		for background in background_group:
			background.hide()
	for background in background_groups[selected_editor_index]:
		background.show()
	
func increment_selected_editor_index(increment):
	var background_group_count = len(background_groups)
	selected_editor_index = (selected_editor_index + increment) % background_group_count
	
	# Handle negative wrap-around
	if selected_editor_index < 0:
		selected_editor_index += background_group_count
		
	if selected_editor_index == BUTTONS_EDITOR:
		test_play_button.grab_focus()
	draw_selected_area()
	
func increment_selected_shape_index(increment):
	var shapes_size = Shapes.SHAPES_DICT.size()
	selected_shape_index = (selected_shape_index + increment) % shapes_size
	
	# Handle negative wrap-around
	if selected_shape_index < 0:
		selected_shape_index += shapes_size
		
const CENTER_ALIGN_QUEUE = Vector2i(1,1)

func draw_shapes():
	self.shapes_tile_map.clear_layer(SHAPES_LAYER)

	var y_offset = Vector2i(0, 0)
	# It's possible, when undoing that the queue length exceeds the visible queue size, so we clamp.
	
	var index = 0
	for shape in Shapes.SHAPES_DICT.values():
		for vector in shape[0]:
			var is_selected = index == selected_shape_index
			var color = GlobalConsts.SPRITE.DARK_ACTIVE if is_selected else GlobalConsts.SPRITE.DARK_INACTIVE
			self.shapes_tile_map.set_cell(SHAPES_LAYER, vector + y_offset + CENTER_ALIGN_QUEUE, GlobalConsts.GEMS_TILE_ID, color) 
		y_offset += Vector2i(0, 4)
		index += 1

func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))

func resume():
	self.disable_player_interaction = false

func pause():
	self.disable_player_interaction = true

func _on_resume_button_pressed():
	self.resume() # Cannot figure out how to use built in get_tree().pause
	pause_menu_container.hide()

func _on_main_menu_button_pressed():
	self.cleanup()
	get_tree().change_scene_to_packed(self.main_menu_scene)

func _on_pause_menu_container_visibility_changed():
	# For some reason this line will error if PuzzleMenuContainer on _ready
	if is_visible_in_tree():
		resume_button.grab_focus()


func _on_action_pressed(action):
	if disable_player_interaction and action != 'escape':
		return
	
	if action == "rotate":
		increment_selected_editor_index(1)
		
	if action == 'escape':
		self.pause()
		self.pause_menu_container.show()
		

	if selected_editor_index == SHAPE_UPSERT_EDITOR:	
		if action == "down":
			increment_selected_shape_index(1)
			draw_shapes()

		if action == "up":
			increment_selected_shape_index(-1)
			draw_shapes()
			
		if action == "left":
			full_queue.increment_selected_full_queue_index(-1)
			
		if action == "right":
			full_queue.increment_selected_full_queue_index(1)		
			
		if action == 'select':
			self.full_queue.append_to_queue(Shapes.SHAPES_DICT.keys()[selected_shape_index])
			
	if selected_editor_index == TARGET_GEM_EDITOR:
		var direction_map = {
			"up": Vector2i.UP,
			"down": Vector2i.DOWN,
			"left": Vector2i.LEFT,
			"right": Vector2i.RIGHT
		}
	
		if action in direction_map:
			gem_placer.move(direction_map[action])
		
		match action:
			"select":
				gem_placer.place_on_board()
				#gem_placer.draw_point()



func _on_check_button_toggled(use_random_shapes):
	if use_random_shapes:
		shapes_tile_map.hide()
	else:
		shapes_tile_map.show()


func _on_test_play_button_pressed():
	var config = ConfigFile.new()
	var levels_path = "user://user_created_levels/"
	DirAccess.make_dir_recursive_absolute(levels_path)
	var full_path = "%s/%d.level" % [levels_path, randi()]
	config.load(full_path)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.LEVEL_DESIGNER_METADATA.QUEUE, full_queue.full_queue)
	config.set_value(GlobalConsts.GAME_SAVE_SECTIONS.Metadata, GlobalConsts.LEVEL_DESIGNER_METADATA.TARGET_GEM, gem_placer.get_points())	
	config.save(full_path)
	GlobalState.level_designer_file_path = full_path
	GlobalState.game_mode = GlobalConsts.GAME_MODE.LevelDesigner
	print('doot')
	get_tree().change_scene_to_packed(game_scene)


func _on_return_to_level_editor_button_pressed():
	pass # Replace with function body.
