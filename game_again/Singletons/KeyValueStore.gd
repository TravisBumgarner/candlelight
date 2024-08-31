extends Node

var config = ConfigFile.new()

var StoreKey = {
	"HasSeenApprenticeship": "HasSeenApprenticeship"
}

func save_data(key: String, value: String):
	assert(key in StoreKey.values(), "Key does not exist in StoreKey")
	
	config.set_value("save_section", key, value)
	config.save("user://key_value_store.cfg")
	
func load_data(key: String) -> String:
	var error = config.load("user://key_value_store.cfg")
	if error == OK:
		return config.get_value("save_section", key, "")
	else:
		# Handle the case where the file doesn't exist
		print("Config file not found. Returning default value.")
		return ""  # Or return a default value
