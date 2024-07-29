class_name Shapes

const l_0 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_90 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_180 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_270 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l := [l_0, l_90, l_180, l_270]

const square_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const square_90 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const square_180 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const square_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const square:= [square_0, square_90, square_180, square_270]

const diag_0 := [Vector2i(0,0), Vector2i(1,1), Vector2i(2,2)]
const diag_90 := [Vector2i(2,0), Vector2i(1,1), Vector2i(0,2)]
const diag:= [diag_0, diag_90, diag_0, diag_90]

const x_0 := [Vector2i(0,0), Vector2i(1,1), Vector2i(2,2), Vector2i(2,0), Vector2i(0,2)]
const x:= [x_0, x_0, x_0, x_0]

const u_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(0,2), Vector2i(1,0), Vector2i(1,2)]
const u_90 := [Vector2i(0,1), Vector2i(0,2), Vector2i(1,2), Vector2i(2,1), Vector2i(2,2)]
const u_180 := [Vector2i(1,0), Vector2i(1,2), Vector2i(2,0), Vector2i(2,1), Vector2i(2,2)]
const u_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(2,0), Vector2i(2,1)]
const u:= [u_0, u_90, u_180, u_270]

const z_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,1), Vector2i(1,2)]
const z_90 := [Vector2i(0,1), Vector2i(1,0), Vector2i(1,1), Vector2i(2,0)]
#const z_180 := [Vector2i(1,0), Vector2i(1,2), Vector2i(2,0), Vector2i(2,1), Vector2i(2,2)]
#const z_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(2,0), Vector2i(2,1)]
const z:= [z_0, z_90, z_0, z_90]

const i_0 := [Vector2i(0,0), Vector2i(1,0)]
const i_90 := [Vector2i(0,0), Vector2i(0,1)]
#const i_180 := [Vector2i(1,0), Vector2i(1,2), Vector2i(2,0), Vector2i(2,1), Vector2i(2,2)]
#const i_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(2,0), Vector2i(2,1)]
const i:= [i_0, i_90, i_0, i_90]

const TOTAL_ROTATIONS = 4
const SHAPES := [l, square, diag, x, u, z, i]

