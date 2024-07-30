extends BaseGame

@onready var level_complete_timer = $LevelCompleteTimer
@onready var level_label = $Level

signal target_gem_updated

var level

# Function called from BaseGame when level completes.
func level_complete(gems):
	can_process_input = false
		
	var total_gems = gems.size()
	
	if total_gems == 1:
		SoundManager.play("one_gem")
	if total_gems >= 2:
		SoundManager.play("two_gems")
		
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(Consts.LEVEL_COMPLETE_TIMER)


func _on_level_complete_timer_timeout():
	level += 1
	level_label.text = str(level)
	Utils.erase_area(tile_map, Consts.GRID_ORIGIN, Consts.GRID_END, Consts.Layer.Board)
	Utils.erase_area(tile_map, Consts.GRID_ORIGIN, Consts.GRID_END, Consts.Layer.Piece)
	gemsManager.puzzle_mode_set_target_gem(level)
	can_process_input = true
	player = Player.new(tile_map, queue.get_next_from_queue())


func new_game():
	super()
	level = 1
	level_label.text = str(level)
	# Seed isn't curren't really needed.
	queue = Queue.new(tile_map, null)
	gemsManager = GemsManager.new(tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)
	player = Player.new(tile_map, queue.get_next_from_queue())


func _ready():
	new_game()


func reset():
	super()
	new_game()


func _on_reset_pressed():
	reset()
