extends Node

var config = ConfigFile.new()

var StoreKey = {
	"HasSeenApprenticeship": "HasSeenApprenticeship",
	"SFXVolume": "SFXVolume",
	"MusicVolume": "MusicVolume"
}

var DEFAULT_VALUES = {
	StoreKey["HasSeenApprenticeship"]: false,
	StoreKey["SFXVolume"]: 0.5,  
	StoreKey["MusicVolume"]: 0.5,
}

const FILENAME = 'user://config.cfg'

# Function to save a specific key-value pair to the config file
func save_data(key: String, value):
	assert(key in StoreKey.values(), "Key does not exist in StoreKey" + key)
	config.set_value("save_section", key, value)
	config.save(FILENAME)

# Function to load a specific key's value from the config file
func load_data(key: String):
	var error = config.load(FILENAME)
	if error == OK:
		return config.get_value("save_section", key, "")
	else:
		# Handle the case where the file doesn't exist, returning default values
		print("Config file not found. Returning default value.")
		return DEFAULT_VALUES[key]
		
# Function to clear all data from the config file
func clear():
	config = ConfigFile.new()
	config.load(FILENAME)
	config.clear()  # Clears all sections and keys
	config.save(FILENAME)

# Function to apply settings (like setting volume) based on the loaded configuration
func apply_config():
	# Load SFX and Music volume from the config, using the default values if necessary
	var sfx_volume = float(load_data(StoreKey["SFXVolume"]))
	var music_volume = float(load_data(StoreKey["MusicVolume"]))
	
	# Set SFX and Music volume on the AudioServer's bus
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("SFX"), linear_to_db(sfx_volume))
	AudioServer.set_bus_volume_db(AudioServer.get_bus_index("Music"), linear_to_db(music_volume))

# Function to load and initialize config if it's empty
func load_or_initialize_config():
	var error = config.load(FILENAME)
	if error != OK:
		# If the config file does not exist or is empty, initialize it with default values
		print("Config file not found or empty. Initializing with default values.")
		for key in StoreKey.values():
			save_data(key, DEFAULT_VALUES[key])
	else:
		# Load all keys and ensure they have the default values if not already set
		for key in StoreKey.values():
			if config.get_value("save_section", key, null) == null:
				save_data(key, DEFAULT_VALUES[key])
