extends BaseGame

var game_key: int
@onready var level_label = $"../Level"

signal experiment_completed
signal game_key_set

# Function called from BaseGame when level completes.
func level_complete(gems):
	can_process_input = false
	SoundManager.play("two_gems")	
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)


func _on_level_complete_timer_timeout():
	Utils.erase_area(tile_map, Vector2i(1, 1), Vector2i(Consts.GRID.WIDTH + 1, Consts.GRID.HEIGHT + 1), Consts.Layer.Board)
	can_process_input = true
	player = Player.new(tile_map, queue.get_next_from_queue())


func new_game():
	super()
	game_key = Utils.generate_key_from_date()
	queue = Queue.new(tile_map, game_key)
	gemsManager = GemsManager.new(tile_map)
	
	emit_signal('game_key_set', game_key)
	gemsManager.daily_mode_set_target_gem(game_key)
	player = Player.new(tile_map, queue.get_next_from_queue())


func _ready():
	new_game()
	
func draw_tiles(atlas_coords):
	for x in range(Consts.GRID.WIDTH):
		for y in range(Consts.GRID.HEIGHT):
			var tile_style = atlas_coords[x][y]
			self.tile_map.erase_cell(Consts.Layer.Board, Vector2i(x,y))
			#if tile_style != Vector2i(-1, -1):
			self.tile_map.set_cell(Consts.Layer.Board, Vector2i(x,y), Consts.GEMS_TILE_ID, tile_style)



