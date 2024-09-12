extends Node2D
class_name Queue

var queue = []
var history = []
var current_game_piece = null
var game_key
var queue_tile_map: TileMap
var is_demo_mode: bool
var visibile_queue_size: int

var RNG

func _init(_queue_tile_map: TileMap, _game_key, _visibile_queue_size, _is_demo_mode = false):
	self.queue_tile_map = _queue_tile_map
	self.game_key = _game_key
	self.visibile_queue_size = _visibile_queue_size
	self.is_demo_mode = _is_demo_mode
	
	RNG = RandomNumberGenerator.new()
	
	if game_key == null:
		RNG.randomize()
	else:
		RNG.seed = game_key


func draw_queue(offset=0):
	# Offest is used for paginating queue for challenges
	queue_tile_map.clear_layer(GlobalConsts.QUEUE_LAYER.QUEUE)

	var y_offset = Vector2i(0, 0)
	# It's possible, when undoing that the queue length exceeds the visible queue size, so we clamp.

	for queue_index in range(offset, offset + self.visibile_queue_size):
		if queue_index >= len(self.queue):
			return
		var piece = self.queue[queue_index]
		for vector in piece[0]:
			var next_in_queue = queue_index == 0
			var color = GlobalConsts.SPRITE.DARK_ACTIVE if next_in_queue else GlobalConsts.SPRITE.DARK_INACTIVE
			self.queue_tile_map.set_cell(GlobalConsts.QUEUE_LAYER.QUEUE, vector + y_offset, GlobalConsts.GEMS_TILE_ID, color) 
		y_offset += Vector2i(0, 4)

func fill_queue():
	while queue.size() <= self.visibile_queue_size:
		if self.is_demo_mode: 
			self.queue.append(Shapes.SHAPES[0])
		else:
			var random  = Utilities.rng_array_item(RNG, Shapes.SHAPES)
			self.queue.append(random)
	self.draw_queue()

func append_to_queue(shape):
	self.queue.append(shape)

func undo(shape):
	self.queue.insert(0, shape)
	self.draw_queue()


func next():
	if current_game_piece:
		self.history.append(current_game_piece)
	current_game_piece = queue.pop_front()
	
	self.draw_queue()
	self.fill_queue()
	return current_game_piece

func size():
	return len(self.queue)

func get_queue():
	return self.queue
	
func empty():
	self.queue.clear()

	
func load(data: Array):
	self.empty()
	self.queue = data
	self.draw_queue()
