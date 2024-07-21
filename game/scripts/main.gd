extends TileMap

@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_background_timer = $PlacePieceOnBackgroundTimer
#const shapes = preload("res://scripts/shapes.gd")
#const Piece = preload("res://scripts/piece.gd")
#const Consts = preload("res://scripts/consts.gd")
##const GemsManager = preload("res://scripts/gems_manager.gd")

var current_piece: Piece
var queue: Queue
var can_process_input = true
var gemsManager: GemsManager

func _process(_delta):
	if can_process_input:
		if Input.is_action_pressed("MOVE_DOWN"):
			current_piece.move_piece(Vector2i.DOWN)
			start_debounce()
		elif Input.is_action_pressed("MOVE_UP"):
			current_piece.move_piece(Vector2i.UP)
			start_debounce()
		elif Input.is_action_pressed("MOVE_RIGHT"):
			current_piece.move_piece(Vector2i.RIGHT)
			start_debounce()
		elif Input.is_action_pressed("MOVE_LEFT"):
			current_piece.move_piece(Vector2i.LEFT)
			start_debounce()
		elif Input.is_action_pressed("ROTATE"):
			current_piece.rotate_piece()
			start_debounce()
		elif Input.is_action_pressed("PLACE"):
			current_piece.draw_piece_on_background()
			start_debounce()
			start_place_piece_on_background_timer()
			var gems = gemsManager.find_gems()
			if(gems.size() > 0):
				level_complete(gems)


func level_complete(gems):
	for gem in gems:
		gemsManager.draw_gem(gem)


func start_debounce():
	can_process_input = false
	debounce_timer.start(Consts.DEBOUNCE_TIMER)


func start_place_piece_on_background_timer():
	can_process_input = false
	place_piece_on_background_timer.start(Consts.PLACE_PIECE_ON_BACKGROUND_TIMER)


func _on_debounce_timer_timeout():
	can_process_input = true


func _on_place_piece_on_background_timer_timeout():
	can_process_input = true
	var next_piece = queue.get_next_from_queue()
	current_piece = Piece.new(self, next_piece)


func new_game():
	gemsManager.draw_target_gem()
	gemsManager.draw_avoid_gem()
	current_piece = Piece.new(self, queue.get_next_from_queue())


func _ready():
	queue = Queue.new(self)
	gemsManager = GemsManager.new(self)
	new_game()
	
	


