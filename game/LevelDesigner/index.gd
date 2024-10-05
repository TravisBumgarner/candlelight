extends Node2D

@onready var check_button = $CheckButton

@onready var shapes_tile_map = $ShapesControl/ShapesTileMap
@onready var full_queue_control = $FullQueueControl
@onready var target_gem_tile_map = $TargetGemControl/TargetGemTileMap

@onready var background_shapes_upsert = $ShapesControl/Background
@onready var background_target_gem = $TargetGemControl/Background
@onready var background_buttons = $ButtonsControl/Background

@onready var test_play_button = $ButtonsControl/TestPlayButton


var gem_placer: GemPlacer
var full_queue: FullQueue

const SHAPES_LAYER = 1
const BACKGROUND_LAYER = 0

var selected_shape_index = 0
var selected_editor_index = 0

var backgrounds
var SHAPE_UPSERT_EDITOR = 0
var TARGET_GEM_EDITOR = 1
var BUTTONS_EDITOR = 2

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

	gem_placer = GemPlacer.new(target_gem_tile_map)
	gem_placer.draw_point()
	var game_key = null
	var visible_queue_size = 3
	full_queue = FullQueue.new(full_queue_control)
	
	backgrounds = [
		background_shapes_upsert,
		background_target_gem,
		background_buttons
	]

	draw_shapes()
	draw_selected_area()
	
func draw_selected_area():
	for background in backgrounds:
		background.hide()
	backgrounds[selected_editor_index].show()
	
func increment_selected_editor_index(increment):
	var selected_area_length = len(backgrounds)
	selected_editor_index = (selected_editor_index + increment) % selected_area_length
	
	# Handle negative wrap-around
	if selected_editor_index < 0:
		selected_editor_index += selected_area_length
		
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

func _on_action_pressed(action):
	if action == "rotate":
		increment_selected_editor_index(1)
		
	if action == 'escape':
		cleanup()

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
				gem_placer.draw_point()



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
