# Piece.gd
extends Node2D
class_name Piece

const Utils = preload("res://scripts/utils.gd")
const Shapes = preload("res://scripts/shapes.gd")
const Consts = preload("res://scripts/consts.gd")

var canvas
var piece_type
var rotation_index
var current_absolute_position

# Constructor
func _init(canvas, piece_type):
	self.canvas = canvas
	self.piece_type = piece_type
	self.rotation_index = 0
	self.current_absolute_position = Vector2i(round(Consts.HEIGHT/2), round(Consts.WIDTH/2))
	self.draw_piece()

func move_piece(direction):
	if can_move(direction):
		erase_piece()
		self.current_absolute_position += direction
		draw_piece()
		

func get_current_piece_rotation():
	return self.piece_type.rotations[self.rotation_index]

func draw_piece():
	for relative_position in self.get_current_piece_rotation():
		var background_tile = self.canvas.get_cell_atlas_coords(Consts.BOARD_LAYER, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(background_tile == null):
			tile_style = Consts.BACKGROUND_PIECE_COLOR
		elif(background_tile == Consts.BACKGROUND_PIECE_COLOR):
			tile_style = Consts.FOREGROUND_PIECE_COLOR
		elif(background_tile == Consts.FOREGROUND_PIECE_COLOR):
			tile_style = Consts.BACKGROUND_PIECE_COLOR
	
		self.canvas.set_cell(Consts.PIECE_LAYER, self.current_absolute_position + relative_position, Consts.TILE_ID, tile_style)


func is_free(position):
	return self.canvas.get_cell_source_id(Consts.BACKGROUND_LAYER, position) == -1


func can_move(direction):
	for point in self.get_current_piece_rotation():
		if not(self.is_free(point + self.current_absolute_position + direction)):
			return false
	return true


func can_rotate():
	pass
	var temporary_rotation_index = (self.rotation_index + 1) % Shapes.SHAPES[0].size()
	for point in piece_type.rotations[temporary_rotation_index]:
		if not self.is_free(point + current_absolute_position):
			return false
	return true


func rotate_piece():
	if self.can_rotate():
		self.erase_piece()
		self.rotation_index = (self.rotation_index + 1) % Shapes.SHAPES[0].size()
		self.draw_piece()


func erase_piece():
	for point in self.get_current_piece_rotation():
		self.canvas.erase_cell(Consts.PIECE_LAYER, current_absolute_position + point)


func draw_piece_on_background():
	pass
	for relative_position in self.get_current_piece_rotation():
		var background_tile = self.canvas.get_cell_atlas_coords(Consts.BOARD_LAYER, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(background_tile == null):
			tile_style = Consts.BACKGROUND_PIECE_COLOR
		elif(background_tile == Consts.BACKGROUND_PIECE_COLOR):
			tile_style = Consts.FOREGROUND_PIECE_COLOR
		elif(background_tile == Consts.FOREGROUND_PIECE_COLOR):
			tile_style = Consts.BACKGROUND_PIECE_COLOR
		self.canvas.erase_cell(Consts.PIECE_LAYER, current_absolute_position + relative_position)
		self.canvas.set_cell(Consts.BOARD_LAYER, current_absolute_position + relative_position, Consts.TILE_ID, tile_style)
	

func is_within_bounds(position: Vector2i):
	return position.x >= 0 and position.x < Consts.HEIGHT and position.y >= 0 and position.y < Consts.WIDTH
