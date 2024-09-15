extends BaseGame
class_name TutorialMode

const INSTRUCTION_NODES = {
	'0_Move' = 0,
	'1_Place' = 1,
	'2_Stack' = 2,
	'3_Undo' = 3,
	'4_Score' = 4,
	'5_Queue' = 5,
	'6_Done' = 6
}

const INSTRUCTION_ARRAY = [
	'0_Move',
	'1_Place',
	'2_Stack',
	'3_Undo',
	'4_Score',
	'5_Queue',
	'6_Done'
]

var tutorial_stage

var STAGE_ACTION_BECOMES_AVAILABLE = {
	GlobalConsts.ACTION['UP']: INSTRUCTION_NODES['0_Move'],
	GlobalConsts.ACTION['DOWN'] : INSTRUCTION_NODES['0_Move'],
	GlobalConsts.ACTION['LEFT'] : INSTRUCTION_NODES['0_Move'],
	GlobalConsts.ACTION['RIGHT'] : INSTRUCTION_NODES['0_Move'],
	GlobalConsts.ACTION['ROTATE'] : INSTRUCTION_NODES['0_Move'],
	GlobalConsts.ACTION['SELECT'] : INSTRUCTION_NODES['1_Place'],
	GlobalConsts.ACTION['UNDO'] : INSTRUCTION_NODES['3_Undo'], 
}

var has_performed_action = {
	GlobalConsts.ACTION["UP"]: false,
	GlobalConsts.ACTION["DOWN"]: false,
	GlobalConsts.ACTION["LEFT"]: false,
	GlobalConsts.ACTION["RIGHT"]: false,
	GlobalConsts.ACTION["ROTATE"]: false,
	GlobalConsts.ACTION["SELECT"]: false,
	GlobalConsts.ACTION["UNDO"]: false, 
}

func _init(args):                
	super(args)
	
func level_complete(gems):
	# Don't look for gems before the scoring stage.
	if tutorial_stage < INSTRUCTION_NODES['4_Score']:
		return
	
	if tutorial_stage == INSTRUCTION_NODES['4_Score']:
		SoundManager.play("one_gem")	
		
	if tutorial_stage == INSTRUCTION_NODES['5_Queue']:
		SoundManager.play("two_gems")	
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	
	level_complete_timer.start(2)

func _on_level_complete_timer_timeout():
	tutorial_stage += 1
	level += 1
	gemsManager.puzzle_mode_set_target_gem(level)
	
	if tutorial_stage != INSTRUCTION_NODES['6_Done']:
		erase_board()
		player = Player.new(board_tile_map, self.queue.next())
	
	update_instructions()



func check_user_performed_action():
	var has_passed_level = false
	if tutorial_stage > INSTRUCTION_NODES['3_Undo']:
		# Levels after Undo complete in different ways.
		return

	if tutorial_stage == INSTRUCTION_NODES['0_Move']:
		var actions_to_check = [GlobalConsts.ACTION["UP"], GlobalConsts.ACTION["DOWN"], GlobalConsts.ACTION["LEFT"], GlobalConsts.ACTION["RIGHT"], GlobalConsts.ACTION["ROTATE"]]
		if actions_to_check.all(func(action): return has_performed_action[action]):
			has_passed_level = true
		
	if tutorial_stage == INSTRUCTION_NODES['1_Place']:
		var actions_to_check = [GlobalConsts.ACTION['SELECT']]
		if actions_to_check.all(func(action): return has_performed_action[action]):
			has_passed_level = true
	
	if tutorial_stage == INSTRUCTION_NODES['2_Stack']:
		var shapes = gemsManager.find_gems_and_shapes()['shapes']
		if len(shapes) > 0:
			has_passed_level = true
	
	if tutorial_stage == INSTRUCTION_NODES['3_Undo']:

		var actions_to_check = [GlobalConsts.ACTION['UNDO']]
		if actions_to_check.all(func(action): return has_performed_action[action]):
			has_passed_level = true
	
	if has_passed_level:
		tutorial_stage += 1

func _on_action_pressed(action):
	var action_not_available_yet = action in STAGE_ACTION_BECOMES_AVAILABLE and STAGE_ACTION_BECOMES_AVAILABLE[action] > tutorial_stage
	var tutorial_complete_restriction = tutorial_stage == INSTRUCTION_NODES['6_Done'] and action != 'escape'
	if action_not_available_yet or tutorial_complete_restriction:
		return
	
	has_performed_action[action] = true
	super(action)

	check_user_performed_action()
	update_instructions()

func new_game():
	level = 1
	tutorial_stage = 0
	
	target_gem_tile_map.hide()
	queue_tile_map.hide()
	game_details_label.hide()
	game_details_value.hide()
	game_details_tile_map.hide()
	
	update_instructions()
	erase_board()
	
	history = History.new()
	
	queue = Queue.new(queue_tile_map, 123, true)
	queue.fill_queue()
	
	player = Player.new(board_tile_map, self.queue.next())
	
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)

func update_game_display():
	pass

func update_instructions():
	if tutorial_stage > 0:
		self.instructions.find_child(INSTRUCTION_ARRAY[tutorial_stage - 1]).hide()
	self.instructions.find_child(INSTRUCTION_ARRAY[tutorial_stage]).show()
		
	if tutorial_stage == INSTRUCTION_NODES['4_Score']:
		target_gem_tile_map.show()

	if tutorial_stage == INSTRUCTION_NODES['5_Queue']:
		var visible_queue_size = 3
		var game_key = 123
		self.queue = Queue.new(queue_tile_map, game_key, visible_queue_size)
		self.queue.fill_queue()
		queue_tile_map.show()


