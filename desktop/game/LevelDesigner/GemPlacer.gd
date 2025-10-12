extends Node2D
class_name GemPlacer

var gem_tile_map: TileMap
var current_position

func _init(_gem_tile_map):
	self.gem_tile_map = _gem_tile_map
	self.current_position = Vector2i(0, 0)
	self._draw_point(self.current_position)
	
func move(direction):
	if can_move(direction):
		AudioPlayer.play_sound("movement")
		self.current_position += direction
		self._draw_point(self.current_position)
	else:
		AudioPlayer.play_sound("nonmovement")
		pass
		
func _draw_point(point):
	self.gem_tile_map.clear_layer(GlobalConsts.CHALLENGE_GEM_LAYER.CURRENT_SHAPE)
	var placed_tile = self.gem_tile_map.get_cell_atlas_coords(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_SHAPES, point)
	var tile_style: Vector2i
	if(placed_tile == GlobalConsts.SPRITE.GEM_BLUE_INACTIVE):
		tile_style = GlobalConsts.SPRITE.DARK_ACTIVE
	elif(placed_tile == GlobalConsts.SPRITE.EMPTY):
		tile_style = GlobalConsts.SPRITE.GEM_BLUE_ACTIVE
	self.gem_tile_map.set_cell(GlobalConsts.CHALLENGE_GEM_LAYER.CURRENT_SHAPE, self.current_position, GlobalConsts.GEMS_TILE_ID, tile_style)
	
func load_points(points):
		for point in points:
				self.gem_tile_map.set_cell(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_SHAPES, point, GlobalConsts.GEMS_TILE_ID, GlobalConsts.SPRITE.GEM_BLUE_INACTIVE)

func get_points():
	var tile_positions = []

	for placed_position in self.gem_tile_map.get_used_cells(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_SHAPES):
		tile_positions.append(placed_position)

	return tile_positions

func can_move(direction):
	var is_cell_border = Utilities.is_cell_border(self.gem_tile_map, self.current_position + direction)
	if is_cell_border:
		return false
	return true

func place_on_board():
	self.gem_tile_map.clear_layer(GlobalConsts.CHALLENGE_GEM_LAYER.CURRENT_SHAPE)
	var placed_tile = self.gem_tile_map.get_cell_atlas_coords(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_SHAPES, self.current_position)
	var tile_style: Vector2i
	
	if(placed_tile == GlobalConsts.SPRITE.GEM_BLUE_INACTIVE):
		tile_style = GlobalConsts.SPRITE.EMPTY
	elif(placed_tile == GlobalConsts.SPRITE.EMPTY):
		tile_style = GlobalConsts.SPRITE.GEM_BLUE_INACTIVE
	else:
		# Handles both null and (-1, -1) for tile. Depending on undo.
		# There's something off here I don't fully understand.
		tile_style = GlobalConsts.SPRITE.GEM_BLUE_INACTIVE
	self.gem_tile_map.set_cell(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_SHAPES, self.current_position, GlobalConsts.GEMS_TILE_ID, tile_style)
	self._draw_point(self.current_position)
