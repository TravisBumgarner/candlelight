extends Node

var inactivity_time := 2.0  # Time in seconds before hiding the cursor
var mouse_timer: Timer

func _ready():
	mouse_timer = Timer.new()
	add_child(mouse_timer)
	mouse_timer.wait_time = inactivity_time
	mouse_timer.one_shot = true
	mouse_timer.connect("timeout", _hide_mouse)

func _input(event):
	if event is InputEventMouseMotion:
		_reset_timer()
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)

func _reset_timer():
	mouse_timer.start()

func _hide_mouse():
	Input.set_mouse_mode(Input.MOUSE_MODE_HIDDEN)
