extends Node2D

func _ready():
	# Access the InputManager singleton and connect the signal
	InputManager.connect("action_pressed", Callable(self, "_on_action_pressed"))

func _on_action_pressed(action):
	match action:
		"up":
			print("up action triggered")
		"down":
			print("down action triggered")
		"left":
			print("left action triggered")
		"right":
			print("right action triggered")
		"undo":
			print("undo action triggered")
		"rotate":
			print("rotate action triggered")
		"select":
			print("select action triggered")
