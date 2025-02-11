import csv
import os
import re
from visualize import SHAPES_DICT
import shutil


def parse_vector2i_list(vector_str):
    # Extract all Vector2i coordinates using regex
    pattern = r'Vector2i\((\d+),\s*(\d+)\)'
    matches = re.findall(pattern, vector_str)
    return [(int(x), int(y)) for x, y in matches]

def parse_shape_list(shape_str):
    # Remove brackets and quotes, split by comma
    shape_str = shape_str.strip('[]')
    return [s.strip().strip('"') for s in shape_str.split(',') if s.strip()]

def generate_shape_svg(shape_coords, cell_size=10, color="#666"):
    # Find bounds to center the shape
    min_x = min(x for x, y in shape_coords)
    max_x = max(x for x, y in shape_coords)
    min_y = min(y for x, y in shape_coords)
    max_y = max(y for x, y in shape_coords)
    width = (max_x - min_x + 1) * cell_size
    height = (max_y - min_y + 1) * cell_size
    
    # Center the shape
    x_offset = -min_x * cell_size
    y_offset = -min_y * cell_size
    
    svg = f'<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">'
    
    for x, y in shape_coords:
        svg += f'<rect x="{x * cell_size + x_offset}" y="{y * cell_size + y_offset}" width="{cell_size-2}" height="{cell_size-2}" fill="{color}" />'
    
    svg += '</svg>'
    return svg

def generate_html():
    levels_path = os.path.join('ingestion', 'Levels - levels.csv')
    
    if not os.path.exists(levels_path):
        print(f"Error: {levels_path} not found")
        return
        
    html = """
    <html>
    <head>
        <style>
            body { 
                font-family: Arial, sans-serif;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            .world-section {
                display: flex;
                flex-direction: row;
                gap: 20px;
                flex-wrap: wrap;
            }
            .levels-wrapper {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .level { 
                margin: 20px;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            .queue {
                display: flex;
                gap: 10px;
                margin: 10px 0;
                align-items: center;
            }
            .shape { display: inline-block; }
            .target-gem { margin-top: 10px; }
            h2 { color: #333; margin-top: 0; }
            .section-label {
                font-weight: bold;
                color: #666;
                margin-right: 10px;
            }
        </style>
    </head>
    <body>
    """
    
    with open(levels_path, 'r') as file:
        reader = csv.DictReader(file)
        
        valid_levels = [level for level in reader if level['unique_id'] != '' and level['world_number'] != '' and level['level_number'] != '']

        levels = sorted(valid_levels, key=lambda x: (int(x['world_number']), int(x['level_number'])))
        
        current_world = None
        html += "<div class='levels-wrapper'>"  # Add wrapper for all levels

        for level in levels:
                
            if current_world != level['world_number']:
                if current_world is not None:
                    html += "</div>"  # Close previous world div
                current_world = level['world_number']
                html += f"<h1>World {current_world}</h1>"
                html += f"<div class='world-section'>"  # Open new world div
            
            html += f"""
            <div class='level'>
                <h2>Level {level['level_number']}</h2>
            """
            
            # Queue visualization
            html += "<div class='queue'><span class='section-label'>Queue:</span>"
            queue = parse_shape_list(level['metadata_queue'])
            for shape_name in queue:
                shape = SHAPES_DICT[shape_name][0]  # Get first rotation
                html += f"<div class='shape'>{generate_shape_svg(shape)}</div>"
            html += "</div>"
            
            # Target gem visualization
            html += "<div class='target-gem'><span class='section-label'>Target:</span>"
            target_gem = parse_vector2i_list(level['metadata_target_gem'])
            html += f"{generate_shape_svg(target_gem, color='#44f')}</div>"
            
            # Add difficulty if it exists
            if level['difficulty']:
                html += f"<div class='difficulty'><span class='section-label'>Difficulty:</span> {level['difficulty']}</div>"

            # Add comments if they exist
            if level['comments']:
                html += f"<div class='comments'><span class='section-label'>Note:</span> {level['comments']}</div>"
            
            html += "</div>"

        if current_world is not None:
            html += "</div>"  # Close last world div
        html += "</div>"  # Close levels-wrapper div
    
    html += """
    </body>
    </html>
    """
    
    with open('level_visualization.html', 'w') as file:
        file.write(html)
    
    print("Generated level_visualization.html")

if __name__ == "__main__":
    generate_html()
