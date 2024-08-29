extends Node

signal play_sound(sound_name)

func play(sound_name):
	emit_signal("play_sound", sound_name)
