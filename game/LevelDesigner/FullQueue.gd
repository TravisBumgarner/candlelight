extends Node2D
class_name FullQueue

var full_queue = []
var history = []
var full_queue_tile_map: TileMap
var selected_full_queue_index = 0

func _init(_queue_control: Control):
	self.full_queue_tile_map = _queue_control.find_child("FullQueueTileMap")

const CENTER_ALIGN_QUEUE = Vector2i(1,1)

func _draw_full_queue():
	self.full_queue_tile_map.clear_layer(GlobalConsts.QUEUE_LAYER.QUEUE)

	var x_offset = Vector2i(0, 0)
	
	var queue_index = 0
	for shape_name in self.full_queue:
		var shape = Shapes.SHAPES_DICT[shape_name]

		var is_selected = selected_full_queue_index == queue_index
		for vector in shape[0]:
			var color = GlobalConsts.SPRITE.DARK_ACTIVE if is_selected else GlobalConsts.SPRITE.DARK_INACTIVE
			self.full_queue_tile_map.set_cell(GlobalConsts.QUEUE_LAYER.QUEUE, vector + x_offset + CENTER_ALIGN_QUEUE, GlobalConsts.GEMS_TILE_ID, color) 
		x_offset += Vector2i(4, 0)
		queue_index += 1

func append_to_queue(shape):
	# Used for Challenge mode
	self.full_queue.append(shape)
	self._draw_full_queue()

func size():
	return len(self.queue)

func increment_selected_full_queue_index(increment):
	var full_queue_size = self.full_queue.size()
	
	if full_queue_size > 0:
		selected_full_queue_index = (selected_full_queue_index + increment) % full_queue_size
	
	# Handle negative wrap-around
	if selected_full_queue_index < 0:
		selected_full_queue_index += full_queue_size
	_draw_full_queue()
