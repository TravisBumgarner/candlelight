extends TileMap

# Assumes a 3x3 Grid for the shape rotation.
# We'll want to programatically generate these later. 
const l_0 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_90 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_180 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_270 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l := [l_0, l_90, l_180, l_270]

const r_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_90 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_180 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r := [r_0, r_90, r_180, r_270]

const shapes := [l, r]

#grid variables
const ROW := 9
const COLS := 9

#game piece variables
var piece_type
var next_piece_type
var rotation_index : int = 0
var active_piece : Array

#tilemap variables
var tile_id := 0
var piece_atlas : Vector2i
var next_piece_atlas : Vector2i

# layer variables. The below two seem to be
# based on the order of layers in the right
# sidebar.
var board_layer : int = 0
var active_layer : int = 1
 

func draw_piece(piece, pos, atlas):
	for i in piece:
		set_cell(active_layer, pos + i, tile_id, atlas)
	
func _process(delta):
	draw_piece(l[0], Vector2i(5,1), Vector2i(1,0))
