extends Node2D
class_name GemsManager

#const Consts = preload("res://scripts/consts.gd")

const TARGET_GEM_ORIGIN = Vector2i(-9, 0)
const TARGET_GEM_END = TARGET_GEM_ORIGIN + Vector2i()

const AVOID_GEM_ORIGIN = Vector2i(-9, 8)
const AVOID_GEM_END = TARGET_GEM_ORIGIN + Vector2i()

# This needs rethinking
# Target gems are drawn in a space from (0,0) -> (WIDTH, HEIGHT)
# this allows for conversions later on assuming overlap.
var target_gem: Array
const avoid_gem := [Vector2i(0, 1), Vector2i(1, 1)]

var canvas

func _init(main):
    self.canvas = main

func level_to_speed_mode_gem_size(level: int) -> int:
    if level < 3:
        return 1
    elif level < 6:
        return 2
    elif level < 10:
        return 3
    elif level < 20:
        return 4
    elif level < 30:
        return 5
    elif level < 50:
        return 6
    elif level < 60:
        return 7
    else:
        return 8  # Assuming you want a default value for levels 60 and above


func generate_speed_mode_gem(size: int):
    var current_point = Vector2i(randi_range(0, Consts.MAX_GEM_WIDTH), randi_range(0, Consts.MAX_GEM_HEIGHT))
    var points = [current_point]
    
    var potential_neighbors = Utils.get_neighboring_cells_on_board(current_point)
    while points.size() < size:
        var new_neighbor = null
        potential_neighbors.shuffle()
        
        var potential_neighbor = potential_neighbors.pop_front()
        while potential_neighbors.size() > 0:
            if potential_neighbor not in points:
                new_neighbor = potential_neighbor
                break
            potential_neighbor = potential_neighbors.pop_front()
        
        # It's possible to end up in an infinite loop should the shape spiral in on itself.
        # I believe This is only possible for gem sizes >= 9 cells. For now, we'll just
        # break early to prevent the infinite loop.
        if new_neighbor == null:
            break
        
        potential_neighbors = Utils.get_neighboring_cells_on_board(new_neighbor)
        points.append(new_neighbor)
    return Utils.move_cells_to_origin(points)

func draw_gem_on_board(gem):
    for absolute_position in gem:
        self.canvas.set_cell(Consts.Layer.Board, absolute_position, Consts.TILE_ID, Consts.Sprite.Gem)


func update_target_gem(level: int):
    var size = self.level_to_speed_mode_gem_size(level)
    target_gem = self.generate_speed_mode_gem(size)
    self.draw_target_gem()
    

func draw_target_gem():
    for point in target_gem:
        self.canvas.set_cell(Consts.Layer.Board, TARGET_GEM_ORIGIN + point, Consts.TILE_ID, Consts.Sprite.Foreground)


func draw_avoid_gem():
    for point in avoid_gem:
        self.canvas.set_cell(Consts.Layer.Board, AVOID_GEM_ORIGIN + point, Consts.TILE_ID, Consts.Sprite.Foreground)


func is_target_gem(shape):
    if(shape.size() != target_gem.size()):
        return false
        
    var relative_shape = Utils.move_cells_to_origin(shape)
    
    var are_equal = arrays_equal(relative_shape, target_gem)
    return are_equal



var visited = []
func find_gems():
    var gems = []
    visited.resize(10)
    for i in range(10):
        visited[i] = []
        visited[i].resize(10)

    #var dark_shapes = find_shapes(Consts.Sprite.Background)
    var light_shapes = find_shapes(Consts.Sprite.Foreground)
    
    for light_shape in light_shapes:
        if is_target_gem(light_shape):
            gems.append(light_shape)
    return gems


func arrays_equal(arr1, arr2) -> bool:
    var arr1_copy = arr1.duplicate()
    var arr2_copy = arr2.duplicate()
    
    if arr1_copy.size() != arr2_copy.size():
        return false

    arr1_copy.sort()
    arr2_copy.sort()

    for i in range(arr1.size()):
        if arr1_copy[i] != arr2_copy[i]:
            return false
    return true









func find_shapes(desired_color: Vector2i):
    var shapes = []
    for x in range(10):
        for y in range(10):
            var color = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, Vector2i(x,y))
            if  color == desired_color and not visited[x][y]:
                var shape = []
                flood_fill(Vector2i(x, y), desired_color, shape)
                if shape.size() > 0:
                    shapes.append(shape)
    return shapes

func flood_fill(pos, desired_color, shape):
    var stack = [pos]

    while stack.size() > 0:
        var current = stack.pop_back()
        var x = current.x
        var y = current.y

        var current_color = self.canvas.get_cell_atlas_coords(Consts.Layer.Board, Vector2i(x,y))
        if visited[x][y] or current_color != desired_color:
            continue

        visited[x][y] = true
        shape.append(current)

        var neighboring_vectors = Utils.get_neighboring_cells_on_board(Vector2i(x,y))
        stack.append_array(neighboring_vectors)
