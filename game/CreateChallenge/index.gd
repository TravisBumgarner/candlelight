extends Node2D

@onready var target_gem_tile_map = $TargetGemTileMap
@onready var check_button = $CheckButton
@onready var shapes_tile_map = $ShapesTileMap
@onready var queue_tile_map = $QueueTileMap

var current_queue_display_start_index = 0

enum CreationMode {
	ShapeSelection,
	GemCreation
}
var creationMode = CreationMode.ShapeSelection

var gemPlacer: GemPlacer
var queue: Queue

const SHAPE_COLUMNS = 3 
const SHAPES_LAYER = 0

var selected_shape_index = 0

func _ready():
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

	gemPlacer = GemPlacer.new(target_gem_tile_map)
	gemPlacer.draw_point()
	var game_key = null
	var visible_queue_size = 3
	queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
	draw_shapes()
	
# Takes the two dimensional selected_shape_index and flattens it to index into Shapes.SHAPES
#func selected_shape_index_to_shape_index():
	#return selected_shape_index[1] * SHAPE_COLUMNS + selected_shape_index[0]
	
# Takes the one dimensional Shapes.SHAPES and turn it into 2d selected_shape_index:
func selected_shape_index_to_shape_grid():
	var x = selected_shape_index % SHAPE_COLUMNS
	var y = selected_shape_index / SHAPE_COLUMNS
	
	return Vector2i(x,y)

func draw_shape(shape, shape_index):
	var shape_column = shape_index % SHAPE_COLUMNS
	var shape_row = shape_index / SHAPE_COLUMNS # Integer division for rows

	var x_offset_between_shapes = shape_column * (GlobalConsts.MAX_PLAYER_SIZE + 1)
	var y_offset_between_shapes = shape_row * (GlobalConsts.MAX_PLAYER_SIZE + 1)
	
	var relative_position = Vector2i(x_offset_between_shapes, y_offset_between_shapes)
		
	for point in shape:
		var tile_style: Vector2i

		# Check for 2D selection
		if selected_shape_index_to_shape_grid() == Vector2i(shape_column, shape_row):
			tile_style = GlobalConsts.SPRITE.DARK_ACTIVE
		else:
			tile_style = GlobalConsts.SPRITE.DARK_INACTIVE

		# Set tile based on relative position
		shapes_tile_map.set_cell(SHAPES_LAYER, point + relative_position, GlobalConsts.GEMS_TILE_ID, tile_style)

func set_next_selected_shape_index(direction):
	var new_index = selected_shape_index + direction
	selected_shape_index = clamp(new_index, 0, len(Shapes.SHAPES) - 1)

func draw_shapes():
	shapes_tile_map.clear_layer(SHAPES_LAYER)
	var shape_index = 0
	for shape in Shapes.SHAPES:
		draw_shape(shape[0], shape_index)
		shape_index += 1

func cleanup():
	# Needs to be called when exiting scene or else Godot will hold reference for previous refs.
	InputManager.disconnect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	match action:
		"toggle":
			if creationMode == CreationMode.ShapeSelection:
				creationMode = CreationMode.GemCreation
			else:
				creationMode = CreationMode.ShapeSelection
		"escape":
			cleanup()
			#self.return_to_main_menu.call()
	
	if creationMode == CreationMode.GemCreation:
		var direction_map = {
			"up": Vector2i.UP,
			"down": Vector2i.DOWN,
			"left": Vector2i.LEFT,
			"right": Vector2i.RIGHT
		}
	
		if action in direction_map:
			gemPlacer.move(direction_map[action])
		
		match action:
			"select":
				gemPlacer.place_on_board()
				gemPlacer.draw_point()
				
	if creationMode == CreationMode.ShapeSelection:
		var shape_selection_map = {
			"left": -1,
			"right": 1
		}
		
		if action in shape_selection_map:
			set_next_selected_shape_index(shape_selection_map[action])
			draw_shapes()
	
		if action == "down":
			# Ensure there are at least 3 elements left in the queue to display
			if self.current_queue_display_start_index + 3 < self.queue.size():
				self.current_queue_display_start_index += 1
				self.queue.draw_queue(self.current_queue_display_start_index)

		if action == "up":
			# Allow the index to go down to 0 to include the first element
			if self.current_queue_display_start_index > 0:
				self.current_queue_display_start_index -= 1
				self.queue.draw_queue(self.current_queue_display_start_index)


		match action:
			"select":
				self.queue.append_to_queue(Shapes.SHAPES[selected_shape_index])
				self.queue.draw_queue()


func _on_check_button_toggled(use_random_shapes):
	if use_random_shapes:
		shapes_tile_map.hide()
	else:
		shapes_tile_map.show()
		
	
	
