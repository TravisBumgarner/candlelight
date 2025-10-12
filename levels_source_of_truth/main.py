import os
import json
import csv
import shutil
import re
import ast

BASE_OUTPUT_PATH = "output"


def copy_to_game_assets():
    """Copy generated levels to game assets directory."""
    source_dir = "./output"
    dest_dir = "../game/assets/puzzle_mode_levels"

    # Remove destination directory if it exists
    if os.path.exists(dest_dir):
        shutil.rmtree(dest_dir)

    # Copy the entire source directory to the destination
    shutil.copytree(source_dir, dest_dir)
    print(f"Copied {source_dir} to {dest_dir}")


def parse_godot_vector2i_array(vector_string):
    """Convert Godot Vector2i array string to list of [x, y] coordinates."""
    # Remove brackets and split by Vector2i
    vector_string = vector_string.strip("[]")
    # Find all Vector2i patterns
    pattern = r"Vector2i\((\d+),\s*(\d+)\)"
    matches = re.findall(pattern, vector_string)
    return [[int(x), int(y)] for x, y in matches]


def parse_queue_array(queue_string):
    """Convert JSON string array to Python list."""
    try:
        return json.loads(queue_string)
    except (json.JSONDecodeError, ValueError):
        # Fallback for malformed JSON
        return ast.literal_eval(queue_string)


def convert_level_to_react_native_format(level):
    """Convert a level from Godot format to React Native format."""
    queue = parse_queue_array(level["metadata_queue"])
    target_gem = parse_godot_vector2i_array(level["metadata_target_gem"])

    return {
        "world_number": int(level["world_number"]),
        "level_number": int(level["level_number"]),
        "unique_id": f"{level['world_number']}_{level['level_number']}",
        "queue": queue,
        "target_gem": target_gem,
        "difficulty": int(level["difficulty"]) if level["difficulty"] else None,
        "comments": level["comments"] if level["comments"] else None,
    }


def format_metadata_to_cfg(level):
    metadata_queue = level["metadata_queue"]
    metadata_target_gem = level["metadata_target_gem"]

    formatted_metadata = f"""
[metadata]

queue={metadata_queue}
target_gem={metadata_target_gem}
"""
    return formatted_metadata.strip()


# Validate that the levels and worlds data is sequential
# The levels data should be sorted by world_number and level_number
def validate_sequential_data(levels_data, worlds_data):
    # Validate worlds_data is sequential
    for i in range(1, len(worlds_data) + 1):
        if int(worlds_data[i - 1]["world_number"]) != i:
            return False

    # Validate levels_data is sequential within each world
    current_world = 1
    current_level = 1
    for level in levels_data:
        world_number = int(level["world_number"])
        level_number = int(level["level_number"])

        if world_number != current_world:
            current_world += 1
            current_level = 1

        if level_number != current_level:
            print(
                f"Level {level['world_number']}_{level['level_number']} is not sequential. Expected level {current_level}, got {level_number}"
            )
            return False

        current_level += 1

    return True


def read_and_sort_levels_and_worlds_data():
    ingestion_folder = "ingestion"
    levels_path = os.path.join(ingestion_folder, "Levels - levels.csv")
    worlds_path = os.path.join(ingestion_folder, "Levels - worlds.csv")

    levels_data = []
    worlds_data = []

    if os.path.isfile(levels_path):
        with open(levels_path, "r") as file:
            reader = csv.DictReader(file)
            levels_data = list(reader)
            valid_levels_data = [
                level
                for level in levels_data
                if level["world_number"] != "" and level["level_number"] != ""
            ]
            levels_data = sorted(
                valid_levels_data,
                key=lambda x: (int(x["world_number"]), int(x["level_number"])),
            )

    if os.path.isfile(worlds_path):
        with open(worlds_path, "r") as file:
            reader = csv.DictReader(file)
            worlds_data = list(reader)
            worlds_data = sorted(worlds_data, key=lambda x: int(x["world_number"]))

    return levels_data, worlds_data


def save_to_cfg(level, file_name):
    output_path = f"./{BASE_OUTPUT_PATH}/{file_name}"

    if not os.path.exists(os.path.dirname(output_path)):
        os.makedirs(os.path.dirname(output_path))

    formatted_metadata = format_metadata_to_cfg(level)
    with open(output_path, "w") as file:
        file.write(formatted_metadata)


def save_to_json(output_dict, levels_data, worlds_data):
    # Save the structured index file for the game
    index_path = f"./{BASE_OUTPUT_PATH}/index.json"
    if not os.path.exists(os.path.dirname(index_path)):
        os.makedirs(os.path.dirname(index_path))

    with open(index_path, "w") as file:
        json.dump(output_dict, file, indent=4)

    # Save a pure JSON file for web use
    web_data = []
    for world_num, world_data in output_dict.items():
        for level in world_data["levels"]:
            web_data.append(
                {
                    "world_number": world_data["world_number"],
                    "world_name": world_data["world_name"],
                    "level_number": level["level_number"],
                    "unique_id": level["unique_id"],
                }
            )

    web_path = f"./{BASE_OUTPUT_PATH}/levels.json"
    with open(web_path, "w") as file:
        json.dump(web_data, file, indent=2)

    # Save React Native compatible JSON with full level data
    react_native_data = {"worlds": [], "levels": {}}

    # Build a mapping of world numbers to their level numbers
    world_levels_map = {}
    for level in levels_data:
        world_num = int(level["world_number"])
        level_num = int(level["level_number"])
        if world_num not in world_levels_map:
            world_levels_map[world_num] = []
        world_levels_map[world_num].append(level_num)

    # Add world data with level numbers
    for world in worlds_data:
        world_num = int(world["world_number"])
        react_native_data["worlds"].append(
            {
                "world_number": world_num,
                "world_name": world["world_name"],
                "level_numbers": sorted(world_levels_map.get(world_num, [])),
            }
        )

    # Add level data with converted format as Record<unique_id, details>
    for level in levels_data:
        react_native_level = convert_level_to_react_native_format(level)
        unique_id = react_native_level["unique_id"]
        # Remove unique_id from the level data since it's now the key
        del react_native_level["unique_id"]
        react_native_data["levels"][unique_id] = react_native_level

    react_native_path = f"./{BASE_OUTPUT_PATH}/react_native_levels.json"
    with open(react_native_path, "w") as file:
        json.dump(react_native_data, file, indent=2)


def map_csv_to_json_and_cfgs(levels_data, worlds_data):
    output = {}
    for world in worlds_data:
        output[world["world_number"]] = {
            "world_number": int(world["world_number"]),
            "world_name": world["world_name"],
            "levels": [],
        }

    for level in levels_data:
        unique_id = f"{level['world_number']}_{level['level_number']}"
        file_name = f"{unique_id}.cfg"

        save_to_cfg(level, file_name)
        output[level["world_number"]]["levels"].append(
            {
                "unique_id": unique_id,
                "level_number": int(level["level_number"]),
                "file_name": file_name,
            }
        )

    save_to_json(output, levels_data, worlds_data)


def empty_output_dir():
    if os.path.exists(BASE_OUTPUT_PATH):
        for file in os.listdir(BASE_OUTPUT_PATH):
            file_path = os.path.join(BASE_OUTPUT_PATH, file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                print(e)


if __name__ == "__main__":
    print("Starting...")

    print("Empty output directory...")
    empty_output_dir()

    print("Read and sort levels and worlds data...")
    levels_data, worlds_data = read_and_sort_levels_and_worlds_data()
    print("Data read:")
    print(f"\tLevels: {len(levels_data)}")
    print(f"\tWorlds: {len(worlds_data)}")

    if len(levels_data) == 0 or len(worlds_data) == 0:
        raise Exception("No data found")

    is_data_sequential = validate_sequential_data(levels_data, worlds_data)
    if not is_data_sequential:
        raise Exception("Data is not sequential")

    output = map_csv_to_json_and_cfgs(levels_data, worlds_data)
    copy_to_game_assets()
