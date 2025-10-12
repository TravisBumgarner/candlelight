extends Node

# Preload music and sound files
const intro_music = preload("res://assets/music/intro.mp3")
const gameplay_music = preload("res://assets/music/gameplay.mp3")
const one_gem = preload("res://assets/sounds/1gem.wav")
const two_gems = preload("res://assets/sounds/2gems.wav")
const movement = preload("res://assets/sounds/movement.wav")
const non_movement = preload("res://assets/sounds/non_movement.wav")

@onready var music_player = $MusicPlayer
@onready var sound_player = $SoundPlayer

func _ready():
	pass

# Play music based on the string input
func play_music(audio_name: String, volume = 0.0):
	var audio: AudioStream = null
	
	# Select the correct music stream based on the input
	match audio_name:
		"intro":
			audio = intro_music
		"gameplay":
			audio = gameplay_music
		_:
			push_error("Song not recognized")
			return
	
	# Play the selected music on the music player
	music_player.stream = audio
	music_player.volume_db = volume
	music_player.bus = "Music"
	music_player.play()

# Play sound effect based on the string input
func play_sound(audio_name: String, volume = 0.0):
	var audio: AudioStream = null
	
	# Select the correct sound stream based on the input
	match audio_name:
		"one_gem":
			audio = one_gem
		"two_gems":
			audio = two_gems
		"movement":
			audio = movement
		"non_movement":
			audio = non_movement
		_:
			push_error("Sound not recognized")
			return
	
	# Play the selected sound on the sound player
	sound_player.bus = "SFX"
	sound_player.stream = audio
	sound_player.volume_db = volume
	sound_player.play()

