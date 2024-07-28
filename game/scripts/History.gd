extends Node

class_name History

# The history array
var history: Array = []

func pop_back():
	return history.pop_back()

func append(item):
	history.append(item)
	print(history)
