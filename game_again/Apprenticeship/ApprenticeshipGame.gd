extends BaseGame
class_name ApprenticeshipGame

var apprenticeship_stage := 1

var STAGE_ACTION_BECOMES_AVAILABLE = {
	GlobalConsts.ACTION['UP']: 1,
	GlobalConsts.ACTION['DOWN'] : 1,
	GlobalConsts.ACTION['LEFT'] : 1,
	GlobalConsts.ACTION['RIGHT'] : 1,
	GlobalConsts.ACTION['ROTATE'] : 1,
	GlobalConsts.ACTION['SELECT'] : 2,
	GlobalConsts.ACTION['UNDO'] : 3, 
}

var has_performed_action = {
	"up": false,
	"down": false,
	"left": false,
	"right": false,
	"rotate": false,
	"select": false,
	"undo": false, 
}

var ACTION_DISPLAY_TEXT = {
	GlobalConsts.ACTION['UP']: "Up ([b]W[/b] Key)",
	GlobalConsts.ACTION['DOWN'] : "Down ([b]S[/b] Key)",
	GlobalConsts.ACTION['LEFT'] : "Left ([b]A[/b] Key)",
	GlobalConsts.ACTION['RIGHT'] : "Right ([b]D[/b] Key)",
	GlobalConsts.ACTION['ROTATE'] : "Rotate ([b]R[/b] Key)",
	GlobalConsts.ACTION['SELECT'] : "Place ([b]Space[/b] Key)",
	GlobalConsts.ACTION['UNDO'] : "Undo ([b]Z[/b] Key)",
}

func _ready():
	print('ready is called')

func _init(board_tile_map: TileMap, target_gem_tile_map: TileMap, queue_tile_map: TileMap, level_complete_timer, sounds, game_details_label, game_details_value, instructions, return_to_main_menu):
	super(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, instructions, return_to_main_menu)

func handle_player_placement():
	player.place_on_board()
	history.append(board_tile_map, player)
	var gems = gemsManager.find_gems()
	if(gems.size() > 0):
		level_complete(gems)
		return
	player = Player.new(board_tile_map, queue.next())

func level_complete(gems):
	SoundManager.play("two_gems")	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	level_complete_timer.start(1)

func _on_level_complete_timer_timeout():
	apprenticeship_stage += 1
	update_instructions()


func increment_level_if_complete():
	if apprenticeship_stage > 3:
		return
	
	var actions_to_check
	if apprenticeship_stage == 1:
		actions_to_check = [
			GlobalConsts.ACTION["UP"],
			GlobalConsts.ACTION["DOWN"],
			GlobalConsts.ACTION["LEFT"],
			GlobalConsts.ACTION["RIGHT"],
			GlobalConsts.ACTION["ROTATE"]			
		]
		
	if apprenticeship_stage == 2:
		actions_to_check = [
			GlobalConsts.ACTION['SELECT']
		]
		
	if apprenticeship_stage == 3:
		actions_to_check = [
			GlobalConsts.ACTION['UNDO']
		]
		
	if actions_to_check.all(func(action): return has_performed_action[action]):
		apprenticeship_stage += 1

func _on_action_pressed(action):
	if action in STAGE_ACTION_BECOMES_AVAILABLE and STAGE_ACTION_BECOMES_AVAILABLE[action] > apprenticeship_stage:
		return
	has_performed_action[action] = true

	increment_level_if_complete()
	update_instructions()
	super(action)

func new_game():
	level = 1
	target_gem_tile_map.hide()
	queue_tile_map.hide()
	update_instructions()
	update_stats()
	erase_board()
	apprenticeship_stage = 1
	history = History.new()
	queue = Queue.new(queue_tile_map, 123, true) # TODO - Set this up
	player = Player.new(board_tile_map, queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)

func update_stats():
	game_details_label.text = "hello"
	game_details_value.text = "world"

func check_action_complete(action):
	var status_marker = "✓" if has_performed_action[action] else "X"
	return ACTION_DISPLAY_TEXT[action] + "      " + status_marker + "\n"
	

func update_instructions():
	var instructions_text = '[center]'
	
	if apprenticeship_stage == 1:
		instructions_text += "Let's get you familiar with setting up experiments.\n"
		instructions_text += check_action_complete('up')
		instructions_text += check_action_complete('down')
		instructions_text += check_action_complete('left')
		instructions_text += check_action_complete('right')
		instructions_text += check_action_complete('rotate')
		
	if apprenticeship_stage == 2:
		instructions_text += "Time for your first experiment!\n"
		instructions_text += check_action_complete('select')
		
	if apprenticeship_stage == 3:
		instructions_text += "Made a mistake? You can undo!\n"
		instructions_text += check_action_complete('undo')

	if apprenticeship_stage == 4:
		target_gem_tile_map.show()
		queue_tile_map.show()
		instructions_text += "Time to match the target gem\n Overlap raw metal pieces to craft gems"
		
	if apprenticeship_stage == 5:
		instructions_text += "And that's all for your training, good luck out there! Press [b]Escape[/b] to get started crafting."
	
	instructions.text = instructions_text
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
