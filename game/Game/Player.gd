extends Node2D
class_name Player

var board_tile_map: TileMap
var shape
var rotation_index
var current_absolute_position


func _init(_board_tile_map, _shape):
	self.board_tile_map = _board_tile_map
	self.shape = _shape
	self.rotation_index = 0
	self.current_absolute_position = GlobalConsts.STARTING_SPACE_ORIGIN
	self._draw()
	
func move(direction):
	if can_move(direction):
		SoundManager.play("movement")
		self.current_absolute_position += direction
		self._draw()
	else:
		SoundManager.play("nonmovement")
		pass
		

func get_current_shape_rotation():
	return self.shape[self.rotation_index]

func _draw():
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_SHAPE)
	for relative_position in self.get_current_shape_rotation():
		var point = self.current_absolute_position + relative_position
		var placed_tile = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_SHAPES, point)
		var is_blocker_tile = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.BLOCKERS, point) != Vector2i(-1,-1)
		var is_out_of_bounds = point[1] < 0
		
		var tile_style: Vector2i
		
		if is_blocker_tile or is_out_of_bounds:
			tile_style = GlobalConsts.SPRITE.INVALID_MOVE
		else:
			if(placed_tile == Vector2i(-1,-1)):
				tile_style = GlobalConsts.SPRITE.DARK_ACTIVE
			elif(placed_tile == GlobalConsts.SPRITE.DARK_INACTIVE):
				tile_style = GlobalConsts.SPRITE.LIGHT_ACTIVE
			elif(placed_tile == GlobalConsts.SPRITE.LIGHT_INACTIVE):
				tile_style = GlobalConsts.SPRITE.DARK_ACTIVE
				
	
		self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.CURRENT_SHAPE, self.current_absolute_position + relative_position, GlobalConsts.GEMS_TILE_ID, tile_style)


func can_move(direction):
	for point in self.get_current_shape_rotation():
		var is_cell_border = Utilities.is_cell_border(self.board_tile_map, point + self.current_absolute_position + direction)
		if is_cell_border:
			return false
	return true
	

func can_place():
	for point in self.get_current_shape_rotation():
		var current_point = point + self.current_absolute_position
		var is_cell_border = Utilities.is_cell_border(self.board_tile_map, current_point)
		if is_cell_border:
			return false

		var is_in_starting_area = current_point[1] < 0
		if is_in_starting_area:
			return false
		
		var is_cell_gem  = Utilities.is_cell_blocker(self.board_tile_map, current_point)
		if is_cell_gem:
			return false
	return true


func can_rotate():
	var temporary_rotation_index = (self.rotation_index + 1) % Shapes.TOTAL_ROTATIONS
	for point in shape[temporary_rotation_index]:
		var is_cell_border = Utilities.is_cell_border(self.board_tile_map, point + current_absolute_position)
		if is_cell_border:
			return false
	return true


func rotate_right():
	if self.can_rotate():
		SoundManager.play("movement")
		self.rotation_index = (self.rotation_index + 1) % Shapes.TOTAL_ROTATIONS
		self._draw()
	else:
		SoundManager.play("nonmovement")
		pass

func place_on_board():
	self.board_tile_map.clear_layer(GlobalConsts.BOARD_LAYER.CURRENT_SHAPE)
	for relative_position in self.get_current_shape_rotation():
		var placed_tile = self.board_tile_map.get_cell_atlas_coords(GlobalConsts.BOARD_LAYER.PLACED_SHAPES, self.current_absolute_position + relative_position)
		var tile_style: Vector2i
		
		if(placed_tile == GlobalConsts.SPRITE.DARK_INACTIVE):
			tile_style = GlobalConsts.SPRITE.LIGHT_INACTIVE
		elif(placed_tile == GlobalConsts.SPRITE.LIGHT_INACTIVE):
			tile_style = GlobalConsts.SPRITE.DARK_INACTIVE
		else:
			# Handles both null and (-1, -1) for tile. Depending on undo.
			# There's something off here I don't fully understand.
			tile_style = GlobalConsts.SPRITE.DARK_INACTIVE
		self.board_tile_map.set_cell(GlobalConsts.BOARD_LAYER.PLACED_SHAPES, current_absolute_position + relative_position, GlobalConsts.GEMS_TILE_ID, tile_style)
