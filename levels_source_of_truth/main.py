import os
import json
import csv
import shutil

BASE_OUTPUT_PATH = 'puzzle_mode_levels'

def format_metadata_to_cfg(level):
    metadata_queue = level['metadata_queue']
    metadata_target_gem = level['metadata_target_gem']

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
        if int(worlds_data[i - 1]['world_number']) != i:
            return False

    # Validate levels_data is sequential within each world
    current_world = 1
    current_level = 1
    for level in levels_data:
        world_number = int(level['world_number'])
        level_number = int(level['level_number'])

        if world_number != current_world:
            current_world += 1
            current_level = 1

        if level_number != current_level:
            return False

        current_level += 1

    return True


def read_and_sort_levels_and_worlds_data():
    ingestion_folder = 'ingestion'
    levels_path = os.path.join(ingestion_folder, 'Levels - levels.csv')
    worlds_path = os.path.join(ingestion_folder, 'Levels - worlds.csv')

    levels_data = []
    worlds_data = []

    if os.path.isfile(levels_path):
        with open(levels_path, 'r') as file:
            reader = csv.DictReader(file)
            levels_data = list(reader)
            levels_data = sorted(levels_data, key=lambda x: (int(x['world_number']), int(x['level_number'])))

    if os.path.isfile(worlds_path):
        with open(worlds_path, 'r') as file:
            reader = csv.DictReader(file)
            worlds_data = list(reader)
            worlds_data = sorted(worlds_data, key=lambda x: int(x['world_number']))


    return levels_data, worlds_data


def save_to_cfg(level, file_name):
    output_path = f'./{BASE_OUTPUT_PATH}/{file_name}'

    if not os.path.exists(os.path.dirname(output_path)):
        os.makedirs(os.path.dirname(output_path))

    formatted_metadata = format_metadata_to_cfg(level)
    with open(output_path, 'w') as file:
        file.write(formatted_metadata)


def save_to_json(output_dict):
    output_path = f'./{BASE_OUTPUT_PATH}/index.json'
    if not os.path.isfile(output_path):
        with open(output_path, 'w') as file:
            json.dump(output_dict, file, indent=4)
    

def map_csv_to_json_and_cfgs(levels_data, worlds_data):
    output = {}
    for world in worlds_data:
        output[world['world_number']] = ({
            'world_number': int(world['world_number']),
            'world_name': world['world_name'],
            'levels': []
        })

    for level in levels_data:
        file_name = f'{level['unique_id']}.cfg'

        save_to_cfg(level, file_name)

        output[level['world_number']]['levels'].append({
            'level_number': int(level['level_number']),
            'file_name': file_name,
        })

    save_to_json(output)


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
    empty_output_dir()

    levels_data, worlds_data = read_and_sort_levels_and_worlds_data()

    is_data_sequential = validate_sequential_data(levels_data, worlds_data)
    if not is_data_sequential:
        raise Exception('Data is not sequential')


    output = map_csv_to_json_and_cfgs(levels_data, worlds_data)

        



