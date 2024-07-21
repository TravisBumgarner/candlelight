extends Node2D
class_name Queue

const Consts = preload("res://scripts/consts.gd")
const Utils = preload("res://scripts/utils.gd")
const Shapes = preload("res://scripts/shapes.gd")

var utils: Utils

const QUEUE_SIZE := 3
var pieces_queue = []
# Called when the node enters the scene tree for the first time.

var canvas

func _init(canvas):
	self.canvas = canvas
	fill_queue()
	utils = Utils.new()


func draw_queue( tile_id):
	var y_offset = Vector2i(0, 0)
	for piece in pieces_queue:
		for point in piece.preview.shape:
			self.canvas.set_cell(Consts.BACKGROUND_LAYER, Consts.QUEUE_PREVIEW_ORIGIN + point + y_offset, tile_id, Consts.FOREGROUND_PIECE_COLOR) 
		y_offset += Vector2i(0, piece.preview.height + 1)

func erase_queue():
	utils.erase_area(self.canvas, Consts.QUEUE_PREVIEW_ORIGIN, Consts.QUEUE_PREVIEW_END, Consts.BACKGROUND_LAYER)

func fill_queue():
	while pieces_queue.size() <= QUEUE_SIZE:
		pieces_queue.append(Shapes.SHAPES.pick_random())


func get_next_from_queue():
	var next_piece = pieces_queue.pop_front()
	self.erase_queue()
	self.draw_queue(Consts.TILE_ID)
	fill_queue()
	return next_piece
	

