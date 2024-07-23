extends CanvasLayer

@onready var experiments_count = $ExperimentsCount
@onready var game_key_label = $GameKeyLabel


var counter := 0
var game_key = ""

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.
	game_key_label.text = game_key


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_daily_board_experiment_completed():
	counter += 1
	print(game_key_label)
	experiments_count.text = str(counter)

func _on_daily_board_game_key_set(value):
	# This event arrives before the component is ready.
	# I'm not sure if this is actually the correct way
	# to do things.
	game_key = value
