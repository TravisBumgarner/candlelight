extends Node2D
class_name GemPlacer

var gem_tile_map: TileMap
var piece_type
var rotation_index
var current_position


func _init(gem_tile_map):
	self.gem_tile_map = gem_tile_map
	self.current_position = Vector2i(0, 0)
	self.draw_piece()
	
func move(direction):
	if can_move(direction):
		SoundManager.play("movement")
		self.current_position += direction
		self.draw_piece()
	else:
		SoundManager.play("nonmovement")
		pass
		
func draw_piece():
	self.gem_tile_map.clear_layer(GlobalConsts.CHALLENGE_GEM_LAYER.CURRENT_PIECE)
	var placed_tile = self.gem_tile_map.get_cell_atlas_coords(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_PIECES, self.current_position)
	var tile_style: Vector2i
	print('debug', placed_tile)
	if(placed_tile == GlobalConsts.SPRITE.EMPTY):
		print('a')
		tile_style = GlobalConsts.SPRITE.GEM_BLUE_ACTIVE
	elif(placed_tile == GlobalConsts.SPRITE.GEM_BLUE_INACTIVE):
		print('b')
		tile_style = GlobalConsts.SPRITE.EMPTY_ACTIVE
	print('result', tile_style)
	self.gem_tile_map.set_cell(GlobalConsts.CHALLENGE_GEM_LAYER.CURRENT_PIECE, self.current_position, GlobalConsts.GEMS_TILE_ID, tile_style)

func can_move(direction):
	var is_cell_border = Utilities.is_cell_border(self.gem_tile_map, self.current_position)
	if is_cell_border:
		return false
	return true

func place_on_board():
	self.gem_tile_map.clear_layer(GlobalConsts.CHALLENGE_GEM_LAYER.CURRENT_PIECE)
	var placed_tile = self.gem_tile_map.get_cell_atlas_coords(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_PIECES, self.current_position)
	var tile_style: Vector2i
	
	if(placed_tile == GlobalConsts.SPRITE.GEM_BLUE_INACTIVE):
		tile_style = GlobalConsts.SPRITE.EMPTY
	elif(placed_tile == GlobalConsts.SPRITE.EMPTY):
		tile_style = GlobalConsts.SPRITE.GEM_BLUE_INACTIVE
	else:
		# Handles both null and (-1, -1) for tile. Depending on undo.
		# There's something off here I don't fully understand.
		tile_style = GlobalConsts.SPRITE.GEM_BLUE_INACTIVE
	self.gem_tile_map.set_cell(GlobalConsts.CHALLENGE_GEM_LAYER.PLACED_PIECES, self.current_position, GlobalConsts.GEMS_TILE_ID, tile_style)
