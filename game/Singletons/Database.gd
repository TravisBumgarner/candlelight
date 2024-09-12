extends Control

var database: SQLite

func _ready():
	database = SQLite.new()
