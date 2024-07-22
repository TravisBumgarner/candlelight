# Piece.gd
extends Node2D
class_name Piece

#const Utils = preload("res://scripts/utils.gd")
#const Shapes = preload("res://scripts/shapes.gd")
#const Consts = preload("res://scripts/consts.gd")

var canvas
var piece_type
var rotation_index
var current_absolute_position

# Constructor
func _init(main, new_piece_type):
	self.canvas = main
	self.piece_type = new_piece_type
	self.rotation_index = 0
	self.current_absolute_position = Vector2i(round(Consts.HEIGHT / 2.0), round(Consts.WIDTH / 2.0))
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
		var background_tile = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(background_tile == Vector2i(-1,-1)):	
			tile_style = Consts.Sprite.Midground
		elif(background_tile == Consts.Sprite.Background):
			tile_style = Consts.Sprite.Foreground
		elif(background_tile == Consts.Sprite.Foreground):
			tile_style = Consts.Sprite.Background
	
		self.canvas.set_cell(Consts.Layer.Piece, self.current_absolute_position + relative_position, Consts.TILE_ID, tile_style)


func is_free(direction):
	return self.canvas.get_cell_source_id(Consts.Layer.Background, direction) == -1


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
		self.canvas.erase_cell(Consts.Layer.Piece, current_absolute_position + point)


func draw_piece_on_background():
	pass
	for relative_position in self.get_current_piece_rotation():
		var background_tile = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(background_tile == null):
			tile_style = Consts.Sprite.Background
		elif(background_tile == Consts.Sprite.Background):
			tile_style = Consts.Sprite.Foreground
		elif(background_tile == Consts.Sprite.Foreground):
			tile_style = Consts.Sprite.Background
		self.canvas.erase_cell(Consts.Layer.Piece, current_absolute_position + relative_position)
		self.canvas.set_cell(Consts.Layer.Board, current_absolute_position + relative_position, Consts.TILE_ID, tile_style)
	

func is_within_bounds(direction: Vector2i):
	return direction.x >= 0 and direction.x < Consts.HEIGHT and direction.y >= 0 and direction.y < Consts.WIDTH
