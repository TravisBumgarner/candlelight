extends CanvasLayer
@onready var experiments = $"../PuzzleBoard/Experiments"

var counter := 0

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass



func _on_puzzle_board_experiment_completed():
	counter += 1
	experiments.text = str(counter)

func _on_puzzle_board_experiment_undo():
	counter -= 1
	experiments.text = str(counter)

func _on_reset_pressed():
	counter = 0
	experiments.text = str(counter)
