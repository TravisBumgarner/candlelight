extends Node

var config = ConfigFile.new()

var StoreKey = {
	"HasSeenApprenticeship": "HasSeenApprenticeship"
}

const FILENAME = 'user://key_value_store.cfg'

func save_data(key: String, value: String):
	assert(key in StoreKey.values(), "Key does not exist in StoreKey")
	
	config.set_value("save_section", key, value)
	config.save(FILENAME)
	
func load_data(key: String) -> String:
	var error = config.load(FILENAME)
	if error == OK:
		return config.get_value("save_section", key, "")
	else:
		# Handle the case where the file doesn't exist
		print("Config file not found. Returning default value.")
		return ""  # Or return a default value
		
func clear():
	config = ConfigFile.new()
	config.load(FILENAME)
	config.clear()  # Clears all sections and keys
	config.save(FILENAME)
