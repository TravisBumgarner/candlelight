extends TileMap

class_name Game

@onready var level_complete_timer = $LevelCompleteTimer
@onready var debounce_timer = $DebounceTimer
@onready var place_piece_on_board_timer = $PlacePieceOnBoardTimer

@onready var sound_one_gem = $"../Sounds/one_gem"
@onready var sound_two_gems = $"../Sounds/two_gems"
@onready var sound_movement = $"../Sounds/movement"
@onready var sound_nonmovement = $"../Sounds/nonmovement"

var current_piece: Piece
var queue: Queue
var can_process_input = true
var gemsManager: GemsManager
var level = 10
@onready var level_label = $"../Level"


func _process(_delta):
	if can_process_input:
		if Input.is_action_pressed("MOVE_DOWN"):
			current_piece.move_piece(Vector2i.DOWN, sound_movement, sound_nonmovement)
			start_debounce()
		elif Input.is_action_pressed("MOVE_UP"):
			current_piece.move_piece(Vector2i.UP, sound_movement, sound_nonmovement)
			start_debounce()
		elif Input.is_action_pressed("MOVE_RIGHT"):
			current_piece.move_piece(Vector2i.RIGHT, sound_movement, sound_nonmovement)
			start_debounce()
		elif Input.is_action_pressed("MOVE_LEFT"):
			current_piece.move_piece(Vector2i.LEFT, sound_movement, sound_nonmovement)
			start_debounce()
		elif Input.is_action_pressed("ROTATE"):
			current_piece.rotate_piece(sound_movement, sound_nonmovement)
			start_debounce()
		elif Input.is_action_pressed("PLACE"):
			current_piece.draw_piece_on_board()
			
			var gems = gemsManager.find_gems()
			if(gems.size() > 0):
				level_complete(gems)
				return
			start_place_piece_on_board_timer()



func level_complete(gems):
	can_process_input = false
		
	var total_gems = gems.size()
	
	if total_gems == 1:
		sound_one_gem.play()
	if total_gems >= 2:
		sound_two_gems.play()
		
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(Consts.LEVEL_COMPLETE_TIMER)

func start_debounce():
	can_process_input = false
	debounce_timer.start(Consts.DEBOUNCE_TIMER)


func start_place_piece_on_board_timer():
	can_process_input = false
	place_piece_on_board_timer.start(Consts.PLACE_PIECE_ON_BOARD_TIMER)


func _on_debounce_timer_timeout():
	can_process_input = true


func _on_place_piece_on_board_timer_timeout():
	can_process_input = true
	current_piece = Piece.new(self, queue.get_next_from_queue())

func _on_level_complete_timer_timeout():
	level += 1
	level_label.text = str(level)
	Utils.erase_area(self, Vector2i(1, 1), Vector2i(Consts.WIDTH + 1, Consts.HEIGHT + 1), Consts.Layer.Board)
	gemsManager.update_target_gem(level)
	can_process_input = true
	current_piece = Piece.new(self, queue.get_next_from_queue())


func new_game():
	gemsManager.update_target_gem(level)
	gemsManager.draw_avoid_gem()
	current_piece = Piece.new(self, queue.get_next_from_queue())


func _ready():
	queue = Queue.new(self)
	gemsManager = GemsManager.new(self)
	new_game()
	
	print(self.get_path())






