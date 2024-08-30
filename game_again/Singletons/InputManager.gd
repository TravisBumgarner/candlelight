extends Node

signal action_pressed(action)

func _input(event):
	if event.is_action_pressed("Up"):
		print('up')	
		emit_signal("action_pressed", "up")
	elif event.is_action_pressed("Down"):
		emit_signal("action_pressed", "down")
	elif event.is_action_pressed("Left"):
		emit_signal("action_pressed", "left")
	elif event.is_action_pressed("Right"):
		emit_signal("action_pressed", "right")
	elif event.is_action_pressed("Undo"):
		emit_signal("action_pressed", "undo")
	elif event.is_action_pressed("Rotate"):
		emit_signal("action_pressed", "rotate")
	elif event.is_action_pressed("Select"):
		emit_signal("action_pressed", "select")
