extends Node2D
class_name Queue



# Note - If a user does undo, it's possible for the actual size of the queue
# to be greater than this value.
const VISIBLE_QUEUE_SIZE := 3
var queue = []
var history = []
var current_game_piece = null
var game_key
var queue_tile_map: TileMap
var is_demo_mode: bool

var RNG

func _init(queue_tile_map: TileMap, game_key, is_demo_mode = false):
	self.queue_tile_map = queue_tile_map
	self.game_key = game_key
	self.is_demo_mode = is_demo_mode
	
	RNG = RandomNumberGenerator.new()
	if game_key == null:
		RNG.randomize()
	else:
		RNG.seed = game_key
	
	self.fill_queue()


func draw_queue():
	var y_offset = Vector2i(0, 0)
	for queue_index in range(0, VISIBLE_QUEUE_SIZE):
		var piece = self.queue[queue_index]

		for vector in piece[0]:
			var next_in_queue = queue_index == 0
			var color = GlobalConsts.SPRITE.DARK_ACTIVE if next_in_queue else GlobalConsts.SPRITE.DARK_INACTIVE
			self.queue_tile_map.set_cell(GlobalConsts.QUEUE_LAYER.QUEUE, vector + y_offset, GlobalConsts.GEMS_TILE_ID, color) 
		y_offset += Vector2i(0, 4)

func erase_queue():
	queue_tile_map.clear_layer(GlobalConsts.QUEUE_LAYER.QUEUE)

func fill_queue():
	while queue.size() <= VISIBLE_QUEUE_SIZE:
		if self.is_demo_mode: 
			self.queue.append(Shapes.SHAPES[0])
		else:
			var random  = Utilities.rng_array_item(RNG, Shapes.SHAPES)
			self.queue.append(random)


func undo(current_game_piece):
	self.queue.insert(0, current_game_piece)
	self.erase_queue()
	self.draw_queue()


func next():
	if current_game_piece:
		self.history.append(current_game_piece)
	current_game_piece = queue.pop_front()
	
	self.erase_queue()
	self.draw_queue()
	self.fill_queue()
	return current_game_piece
	

