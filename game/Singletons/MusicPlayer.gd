extends AudioStreamPlayer

const intro_music = preload("res://assets/music/intro.mp3")
const gameplay_music = preload("res://assets/music/gameplay.mp3")
func _play_music(music: AudioStream, volume = 0.0):
	if stream == music:
		return
		
	stream = music
	volume_db = volume
	play()
	
func play_intro_music():
	_play_music(intro_music)

func play_game_music():
	_play_music(gameplay_music)
