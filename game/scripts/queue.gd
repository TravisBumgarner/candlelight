extends Node2D
class_name Queue


const QUEUE_SIZE := 3
var pieces_queue = []
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



func draw_queue( tile_id):
	var y_offset = Vector2i(0, 0)
	for piece in pieces_queue:
		for point in piece.preview.shape:
			self.canvas.set_cell(Consts.Layer.Background, Consts.QUEUE_PREVIEW_ORIGIN + point + y_offset, tile_id, Consts.Sprite.Midground) 
		y_offset += Vector2i(0, piece.preview.height + 1)


func erase_queue():
	Utils.erase_area(self.canvas, Consts.QUEUE_PREVIEW_ORIGIN, Consts.QUEUE_PREVIEW_END, Consts.Layer.Background)


func fill_queue():
	while pieces_queue.size() <= QUEUE_SIZE:
		var random  = Utils.rng_array_item(RNG, Shapes.SHAPES)
		pieces_queue.append(random)


func get_next_from_queue():
	var next_piece = pieces_queue.pop_front()
	self.erase_queue()
	self.draw_queue(Consts.TILE_ID)
	fill_queue()
	return next_piece
	

