extends Node

func generate_key():
	var today_format_string = "%s-%s-%s"
	var today := Time.get_date_dict_from_system()
	var today_string = today_format_string % [today.year, today.month, today.day] 
	# This might be terrible. Please forgive me lol.
	return int(str(hash(today_string)).substr(0, 6))


func swap(i : int, j : int, a : Array) -> Array:
	var t = a[i]
	a[i] = a[j]
	a[j] = t
	return a

func shuffle_rng_array(rng: RandomNumberGenerator, arr: Array):
	for i in range(arr.size()):
		var j = rng.randi_range(0, arr.size() - 1)
		swap(i, j, arr)
