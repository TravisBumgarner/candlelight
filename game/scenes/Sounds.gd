extends Node

func play_sound(sound_name):
	var sound = get_node(sound_name)
	if sound and sound is AudioStreamPlayer:
		sound.play()
	else:
		print("Sound node not found or is not an AudioStreamPlayer: " + sound_name)
