extends Node

signal action_pressed(action)

var last_input_type = "Unknown"  # Tracks the last input type

func _input(event):
	if event is InputEventKey:
		GlobalState.last_input_type = "Keyboard"
	elif event is InputEventJoypadButton or event is InputEventJoypadMotion:
		GlobalState.last_input_type = "Controller"

	if event.is_action_pressed("ui_up"):
		emit_signal("action_pressed", "up")
	elif event.is_action_pressed("ui_down"):
		emit_signal("action_pressed", "down")
	elif event.is_action_pressed("ui_left"):
		emit_signal("action_pressed", "left")
	elif event.is_action_pressed("ui_right"):
		emit_signal("action_pressed", "right")
	elif event.is_action_pressed("Undo"):
		emit_signal("action_pressed", "undo")
	elif event.is_action_pressed("Rotate"):
		emit_signal("action_pressed", "rotate")
	elif event.is_action_pressed("Select"):
		emit_signal("action_pressed", "select")
	elif event.is_action_pressed("Escape"):
		emit_signal("action_pressed", "escape")
	elif event.is_action_pressed("Toggle"):
		emit_signal("action_pressed", "toggle")

