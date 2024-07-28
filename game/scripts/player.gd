# Piece.gd
extends Node2D
class_name Player

var canvas
var piece_type
var rotation_index
var current_absolute_position

# Constructor
func _init(main, new_piece_type):
	self.canvas = main
	self.piece_type = new_piece_type
	self.rotation_index = 0
	self.current_absolute_position = Vector2i(round(Consts.GRID.HEIGHT / 2.0), round(Consts.GRID.WIDTH / 2.0))
	self.draw_piece()


func move_piece(direction):
	if can_move(direction):
		SoundManager.play("movement")
		self.erase_piece()
		self.current_absolute_position += direction
		self.draw_piece()
	else:
		SoundManager.play("nonmovement")
		

func get_current_piece_rotation():
	return self.piece_type.rotations[self.rotation_index]

func draw_piece():
	print('draw piece')
	for relative_position in self.get_current_piece_rotation():
		var background_tile = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, self.current_absolute_position + relative_position)
		print(background_tile)
		var tile_style: Vector2i
		
		if(background_tile == Vector2i(-1,-1)):	
			tile_style = Consts.Sprite.Midground
		elif(background_tile == Consts.Sprite.Background):
			tile_style = Consts.Sprite.Foreground
		elif(background_tile == Consts.Sprite.Foreground):
			tile_style = Consts.Sprite.Background
	
		self.canvas.set_cell(Consts.Layer.Piece, self.current_absolute_position + relative_position, Consts.GEMS_TILE_ID, tile_style)


func can_move(direction):
	for point in self.get_current_piece_rotation():
		if not(Utils.is_cell_free(self.canvas, point + self.current_absolute_position + direction)):
			return false
	return true


func can_rotate():
	pass
	var temporary_rotation_index = (self.rotation_index + 1) % Shapes.SHAPES[0].size()
	for point in piece_type.rotations[temporary_rotation_index]:
		if not Utils.is_cell_free(self.canvas, point + current_absolute_position):
			return false
	return true


func rotate_piece():
	if self.can_rotate():
		SoundManager.play("movement")
		self.erase_piece()
		self.rotation_index = (self.rotation_index + 1) % Shapes.SHAPES[0].size()
		self.draw_piece()
	else:
		SoundManager.play("nonmovement")


func erase_piece():
	print('erase piece')
	for point in self.get_current_piece_rotation():
		self.canvas.erase_cell(Consts.Layer.Piece, current_absolute_position + point)


func draw_piece_on_board():
	for relative_position in self.get_current_piece_rotation():
		var background_tile = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		print('draw_piece_on_board', relative_position, background_tile)
		
		if(background_tile == Consts.Sprite.Background):
			tile_style = Consts.Sprite.Foreground
		elif(background_tile == Consts.Sprite.Foreground):
			tile_style = Consts.Sprite.Background
		else:
			# Handles both null and (-1, -1) for tile. Depending on undo.
			# There's something off here I don't fully understand.
			tile_style = Consts.Sprite.Background
		print('tilestyle', tile_style)
		self.canvas.erase_cell(Consts.Layer.Piece, current_absolute_position + relative_position)
		self.canvas.set_cell(Consts.Layer.Board, current_absolute_position + relative_position, Consts.GEMS_TILE_ID, tile_style)
	

func is_within_bounds(direction: Vector2i):
	return direction.x >= 0 and direction.x < Consts.GRID.HEIGHT and direction.y >= 0 and direction.y < Consts.GRID.WIDTH
