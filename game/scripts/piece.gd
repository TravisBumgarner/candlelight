# Piece.gd
extends Node
class_name Piece

# Constructor
func _init(name: String):
	self.name = name

func who_am_i():
	print("I am", self.name)
