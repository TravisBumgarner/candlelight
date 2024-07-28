extends Node2D
class_name Queue

# Note - If a user does undo, it's possible for the actual size of the queue
# to be greater than this value.
const VISIBLE_QUEUE_SIZE := 3
var queue = []
var history = []
var current_game_piece = null
var game_key
var canvas
var RNG

func _init(main, game_key):
	self.canvas = main
	self.game_key = game_key
	
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
		for vector in piece.preview.vectors:
			self.canvas.set_cell(Consts.Layer.Background, Consts.QUEUE_PREVIEW_ORIGIN + vector + y_offset, Consts.TILE_ID, Consts.Sprite.Midground) 
		y_offset += Vector2i(0, piece.preview.height + 1)


func erase_queue():
	Utils.erase_area(self.canvas, Consts.QUEUE_PREVIEW_ORIGIN, Consts.QUEUE_PREVIEW_END, Consts.Layer.Background)


func fill_queue():
	while queue.size() <= VISIBLE_QUEUE_SIZE:
		var random  = Utils.rng_array_item(RNG, Shapes.SHAPES)
		self.queue.append(random)


func undo(current_game_piece):
	self.queue.insert(0, current_game_piece)
	self.erase_queue()
	self.draw_queue()


func get_next_from_queue():
	if current_game_piece:
		self.history.append(current_game_piece)
	current_game_piece = queue.pop_front()
	
	self.erase_queue()
	self.draw_queue()
	self.fill_queue()
	return current_game_piece
	

