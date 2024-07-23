extends Node

func generate_key():
	var today_format_string = "%s-%s-%s"
	var today := Time.get_date_dict_from_system()
	var today_string = today_format_string % [today.year, today.month, today.day] 
	return today_string.sha256_text().substr(0, 6)
