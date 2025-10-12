extends Node

@onready var label = $Label
@onready var slider = $Slider

@export
var bus_name: String

@export
var label_name: String

var bus_index: int

var on_value_changed_callback: Callable

func _ready():
	var value = KeyValueStore.load_data(KeyValueStore.StoreKey[bus_name + "Volume"])
	label.text = label_name
	bus_index = AudioServer.get_bus_index(bus_name)
	slider.value_changed.connect(_on_value_changed)
	slider.value = value

	connect("focus_entered", _on_focus_entered)
	
func _on_value_changed(value: float) -> void:
	AudioServer.set_bus_volume_db(
		bus_index,
		linear_to_db(value)
	)
	
	var key = bus_name + "Volume"
	KeyValueStore.save_data(key, value)
	
	if self.on_value_changed_callback:
		self.on_value_changed_callback.call(value)

# Focus handler to grab focus for the slider when the component is focused
func _on_focus_entered():
	slider.grab_focus()
