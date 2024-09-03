extends BaseGame
class_name ApprenticeshipGame

enum ApprenticeshipStage {
	OneMovement,
	TwoPlacement,
	ThreeUndo,
	FourScore,
	FiveQueue,
	SixDone
}

var apprenticeship_stage: ApprenticeshipStage

var STAGE_ACTION_BECOMES_AVAILABLE = {
	GlobalConsts.ACTION['UP']: ApprenticeshipStage.OneMovement,
	GlobalConsts.ACTION['DOWN'] : ApprenticeshipStage.OneMovement,
	GlobalConsts.ACTION['LEFT'] : ApprenticeshipStage.OneMovement,
	GlobalConsts.ACTION['RIGHT'] : ApprenticeshipStage.OneMovement,
	GlobalConsts.ACTION['ROTATE'] : ApprenticeshipStage.OneMovement,
	GlobalConsts.ACTION['SELECT'] : ApprenticeshipStage.TwoPlacement,
	GlobalConsts.ACTION['UNDO'] : ApprenticeshipStage.ThreeUndo, 
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

var ACTION_DISPLAY_TEXT = {
	GlobalConsts.ACTION['UP']: "Up ([b]W[/b] Key)",
	GlobalConsts.ACTION['DOWN'] : "Down ([b]S[/b] Key)",
	GlobalConsts.ACTION['LEFT'] : "Left ([b]A[/b] Key)",
	GlobalConsts.ACTION['RIGHT'] : "Right ([b]D[/b] Key)",
	GlobalConsts.ACTION['ROTATE'] : "Rotate ([b]R[/b] Key)",
	GlobalConsts.ACTION['SELECT'] : "Place ([b]Space[/b] Key)",
	GlobalConsts.ACTION['UNDO'] : "Undo ([b]Z[/b] Key)",
}

func _init(board_tile_map: TileMap, target_gem_tile_map: TileMap, queue_tile_map: TileMap, level_complete_timer, sounds, game_details_label, game_details_value, game_details_tile_map, instructions, return_to_main_menu):
	super(board_tile_map, target_gem_tile_map, queue_tile_map, level_complete_timer, sounds, game_details_label, game_details_value, game_details_tile_map, instructions, return_to_main_menu)

func handle_player_placement():
	player.place_on_board()
	history.append(board_tile_map, player)
	var gems = gemsManager.find_gems()
	if(gems.size() > 0):
		level_complete(gems)
		return
	player = Player.new(board_tile_map, self.queue.next())

func level_complete(gems):
	if apprenticeship_stage == ApprenticeshipStage.FourScore:
		SoundManager.play("one_gem")	
		
	if apprenticeship_stage == ApprenticeshipStage.FiveQueue:
		SoundManager.play("two_gems")	
	
	for gem in gems:
		gemsManager.draw_gem_on_board(gem)
	
	level_complete_timer.start(1)

func _on_level_complete_timer_timeout():
	apprenticeship_stage += 1
	level += 1
	gemsManager.puzzle_mode_set_target_gem(level)
	
	if apprenticeship_stage != ApprenticeshipStage.SixDone:
		erase_board()
		player = Player.new(board_tile_map, self.queue.next())
	
	update_instructions()



func check_user_performed_action():
	if apprenticeship_stage > ApprenticeshipStage.ThreeUndo:
		# Levels after ThreeUndo complete in different ways.
		return
	
	var actions_to_check
	if apprenticeship_stage == ApprenticeshipStage.OneMovement:
		actions_to_check = [
			GlobalConsts.ACTION["UP"],
			GlobalConsts.ACTION["DOWN"],
			GlobalConsts.ACTION["LEFT"],
			GlobalConsts.ACTION["RIGHT"],
			GlobalConsts.ACTION["ROTATE"]
		]
		
	if apprenticeship_stage == ApprenticeshipStage.TwoPlacement:
		actions_to_check = [
			GlobalConsts.ACTION['SELECT']
		]
		
	if apprenticeship_stage == ApprenticeshipStage.ThreeUndo:
		actions_to_check = [
			GlobalConsts.ACTION['UNDO']
		]
		
	if actions_to_check.all(func(action): return has_performed_action[action]):
		apprenticeship_stage += 1

func _on_action_pressed(action):
	var action_not_available_yet = action in STAGE_ACTION_BECOMES_AVAILABLE and STAGE_ACTION_BECOMES_AVAILABLE[action] > apprenticeship_stage
	var block_placement_while_undo_stage = action == GlobalConsts.ACTION['SELECT'] and apprenticeship_stage == ApprenticeshipStage.ThreeUndo
	if action_not_available_yet or block_placement_while_undo_stage:
		return
	
	has_performed_action[action] = true

	check_user_performed_action()
	update_instructions()
	
	super(action)

func new_game():
	level = 1
	target_gem_tile_map.hide()
	queue_tile_map.hide()
	game_details_label.hide()
	game_details_value.hide()
	game_details_tile_map.hide()
	update_instructions()
	update_stats()
	erase_board()
	apprenticeship_stage = ApprenticeshipStage.OneMovement
	history = History.new()
	self.queue = Queue.new(queue_tile_map, 123, true)
	player = Player.new(board_tile_map, self.queue.next())
	gemsManager = GemsManager.new(board_tile_map, target_gem_tile_map, queue_tile_map)
	gemsManager.puzzle_mode_set_target_gem(level)

func update_stats():
	game_details_label.text = "hello"
	game_details_value.text = "world"

func check_action_complete(action):
	var status_marker = "✓" if has_performed_action[action] else "X"
	return ACTION_DISPLAY_TEXT[action] + "      " + status_marker + "\n"
	

func update_instructions():
	var text = '[center]'
	
	if apprenticeship_stage == ApprenticeshipStage.OneMovement:
		text += "Move and manipulate the lead piece on the anvil.\n"
		text += '[/center]'
		text += check_action_complete('up')
		text += check_action_complete('down')
		text += check_action_complete('left')
		text += check_action_complete('right')
		text += check_action_complete('rotate')
		
	if apprenticeship_stage == ApprenticeshipStage.TwoPlacement:
		text += "Place the lead piece on the anvil.\n"
		text += check_action_complete('select')
		
	if apprenticeship_stage == ApprenticeshipStage.ThreeUndo:
		text += "Remove the lead piece from the anvil.\n"
		text += check_action_complete('undo')

	if apprenticeship_stage == ApprenticeshipStage.FourScore:
		target_gem_tile_map.show()
		text += "Overlap lead pieces on the anvil to begin alchemizing. Match the light colored overlap to the target to perform alchemy."
		
	if apprenticeship_stage == ApprenticeshipStage.FiveQueue:
		self.queue = Queue.new(queue_tile_map, 123)
		queue_tile_map.show()
		text += "The queue shows what lead pieces are coming next. Continue performing alchemy."
		
	if apprenticeship_stage == ApprenticeshipStage.SixDone:
		text += "The skills to begin alchemy are simple, but the journey is hard. Good luck out there! Press [b]Escape[/b] to get started crafting."
	
	instructions.text = text

