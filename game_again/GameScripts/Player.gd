extends Node2D
class_name Player

var tile_map: TileMap
var piece_type
var rotation_index
var current_absolute_position


func _init(main, new_piece_type):
	self.tile_map = main
	self.piece_type = new_piece_type
	self.rotation_index = 0
	self.current_absolute_position = Vector2i(round(GlobalConsts.GRID.HEIGHT / 2.0 - 1), round(GlobalConsts.GRID.WIDTH / 2.0 - 1))
	self.draw_piece()
	
func move(direction):
	if can_move(direction):
		SoundManager.play("movement")
		self.current_absolute_position += direction
		self.draw_piece()
	else:
		SoundManager.play("nonmovement")
		pass
		

func get_current_piece_rotation():
	return self.piece_type[self.rotation_index]

func draw_piece():
	self.tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_PIECE)
	for relative_position in self.get_current_piece_rotation():
		var placed_tile = self.tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_PIECES, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(placed_tile == Vector2i(-1,-1)):
			tile_style = GlobalConsts.SPRITE.DARK_ACTIVE
		elif(placed_tile == GlobalConsts.SPRITE.DARK_INACTIVE):
			tile_style = GlobalConsts.SPRITE.LIGHT_ACTIVE
		elif(placed_tile == GlobalConsts.SPRITE.LIGHT_INACTIVE):
			tile_style = GlobalConsts.SPRITE.DARK_ACTIVE
	
		self.tile_map.set_cell(GlobalConsts.BOARD_LAYER.CURRENT_PIECE, self.current_absolute_position + relative_position, GlobalConsts.GEMS_TILE_ID, tile_style)


func can_move(direction):
	for point in self.get_current_piece_rotation():
		var is_cell_border = Utilities.is_cell_border(self.tile_map, point + self.current_absolute_position + direction)
		if is_cell_border:
			return false
	return true


func can_rotate():
	var temporary_rotation_index = (self.rotation_index + 1) % Shapes.SHAPES[0].size()
	for point in piece_type[temporary_rotation_index]:
		var is_cell_border = Utilities.is_cell_border(self.tile_map, point + current_absolute_position)
		if is_cell_border:
			return false
	return true


func rotate_right():
	if self.can_rotate():
		SoundManager.play("movement")
		self.rotation_index = (self.rotation_index + 1) % Shapes.TOTAL_ROTATIONS
		self.draw_piece()
	else:
		SoundManager.play("nonmovement")
		pass

func place_on_board():
	self.tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_PIECE)
	for relative_position in self.get_current_piece_rotation():
		var placed_tile = self.tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_PIECES, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(placed_tile == GlobalConsts.SPRITE.DARK_INACTIVE):
			tile_style = GlobalConsts.SPRITE.LIGHT_INACTIVE
		elif(placed_tile == GlobalConsts.SPRITE.LIGHT_INACTIVE):
			tile_style = GlobalConsts.SPRITE.DARK_INACTIVE
		else:
			# Handles both null and (-1, -1) for tile. Depending on undo.
			# There's something off here I don't fully understand.
			tile_style = GlobalConsts.SPRITE.DARK_INACTIVE
		self.tile_map.set_cell(GlobalConsts.BOARD_LAYER.PLACED_PIECES, current_absolute_position + relative_position, GlobalConsts.GEMS_TILE_ID, tile_style)
