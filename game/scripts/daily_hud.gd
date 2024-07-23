extends CanvasLayer

@onready var experiments_count = $ExperimentsCount

var counter := 0

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_daily_board_experiment_completed():
	counter += 1
	experiments_count.text = str(counter)
