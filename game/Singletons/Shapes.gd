extends Node

const upper_l_rot0 = [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const upper_l_rot1 = [Vector2i(0,2), Vector2i(1,1), Vector2i(2,0)]
const upper_l_rot2 = [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const upper_l_rot3 = [Vector2i(0,0), Vector2i(1,1), Vector2i(2,2)]
const upper_l = [upper_l_rot0, upper_l_rot1, upper_l_rot2, upper_l_rot3]

const square_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const square = [square_rot0, square_rot0, square_rot0, square_rot0]

const u_rot3 = [Vector2i(0,0), Vector2i(0,1), Vector2i(0,2), Vector2i(1,0), Vector2i(1,2)]
const u_rot2 = [Vector2i(0,1), Vector2i(0,2), Vector2i(1,2), Vector2i(2,1), Vector2i(2,2)]
const u_rot1 = [Vector2i(1,0), Vector2i(1,2), Vector2i(2,0), Vector2i(2,1), Vector2i(2,2)]
const u_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(2,0), Vector2i(2,1)]
const u = [u_rot0, u_rot1, u_rot2, u_rot3]

const lower_z_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,1), Vector2i(1,2)]
const lower_z_rot1 = [Vector2i(0,1), Vector2i(1,0), Vector2i(1,1), Vector2i(2,0)]
const lower_z = [lower_z_rot0, lower_z_rot1, lower_z_rot0, lower_z_rot1]

const upper_z_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,1), Vector2i(2,1), Vector2i(2,2)]
const upper_z_rot1 = [Vector2i(0,2), Vector2i(1,0), Vector2i(1,1), Vector2i(1,2), Vector2i(2,0)]
const upper_z = [upper_z_rot0, upper_z_rot1, upper_z_rot0, upper_z_rot1]

const w_rot3 = [Vector2i(0,0), Vector2i(1,0), Vector2i(1,1), Vector2i(2,1), Vector2i(2,2)]
const w_rot2 = [Vector2i(0,2), Vector2i(0,1), Vector2i(1,1), Vector2i(1,0), Vector2i(2,0)]
const w_rot1 = [Vector2i(2,2), Vector2i(1,2), Vector2i(1,1), Vector2i(0,1), Vector2i(0,0)]
const w_rot0 = [Vector2i(2,0), Vector2i(2,1), Vector2i(1,1), Vector2i(1,2), Vector2i(0,2)]
const w = [w_rot0, w_rot1, w_rot2, w_rot3]

const t_rot3 = [Vector2i(0,0), Vector2i(1,0), Vector2i(1,1), Vector2i(1,2), Vector2i(2,0)]
const t_rot2 = [Vector2i(0,2), Vector2i(0,1), Vector2i(1,1), Vector2i(2,1), Vector2i(0,0)]
const t_rot1 = [Vector2i(2,2), Vector2i(1,2), Vector2i(1,1), Vector2i(1,0), Vector2i(0,2)]
const t_rot0 = [Vector2i(2,0), Vector2i(2,1), Vector2i(1,1), Vector2i(0,1), Vector2i(2,2)]
const t = [t_rot0, t_rot1, t_rot2, t_rot3]

const TOTAL_ROTATIONS = 4
const SHAPES_DICT = {
	"upper_l": upper_l,
	"square": square,
	"u": u,
	"lower_z": lower_z,
	"upper_z": upper_z,
	"w": w,
	"t": t
}
