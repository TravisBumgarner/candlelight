extends Node

const upper_l_rot0 = [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const upper_l_rot1 = [Vector2i(0,2), Vector2i(1,1), Vector2i(2,0)]
const upper_l_rot2 = [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const upper_l_rot3 = [Vector2i(0,0), Vector2i(1,1), Vector2i(2,2)]
const upper_l = [upper_l_rot0, upper_l_rot1, upper_l_rot2, upper_l_rot3]

const square_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const square = [square_rot0, square_rot0, square_rot0, square_rot0]

const upper_i_rot0 = [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const upper_i_rot1 = [Vector2i(0,2), Vector2i(1,1), Vector2i(2,0)]
const upper_i_rot2 = [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const upper_i_rot3 = [Vector2i(0,0), Vector2i(1,1), Vector2i(2,2)]
const upper_i = [upper_i_rot0, upper_i_rot1, upper_i_rot2, upper_i_rot3]

const u_rot3 = [Vector2i(0,0), Vector2i(0,1), Vector2i(0,2), Vector2i(1,0), Vector2i(1,2)]
const u_rot2 = [Vector2i(0,1), Vector2i(0,2), Vector2i(1,2), Vector2i(2,1), Vector2i(2,2)]
const u_rot1 = [Vector2i(1,0), Vector2i(1,2), Vector2i(2,0), Vector2i(2,1), Vector2i(2,2)]
const u_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(2,0), Vector2i(2,1)]
const u = [u_rot0, u_rot1, u_rot2, u_rot3]

const lowwer_z_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,1), Vector2i(1,2)]
const lowwer_z_rot1 = [Vector2i(0,1), Vector2i(1,0), Vector2i(1,1), Vector2i(2,0)]
const lowwer_z = [lowwer_z_rot0, lowwer_z_rot1, lowwer_z_rot0, lowwer_z_rot1]

const lower_i_rot0 = [Vector2i(0,0), Vector2i(0,1)]
const lower_i_rot1 = [Vector2i(0,1), Vector2i(1,0)]
const lower_i_rot2 = [Vector2i(0,0), Vector2i(1,0)]
const lower_i_rot3 = [Vector2i(0,0), Vector2i(1,1)]
const lower_i = [lower_i_rot0, lower_i_rot1, lower_i_rot2, lower_i_rot3]

const upper_z_rot0 = [Vector2i(0,0), Vector2i(0,1), Vector2i(1,1), Vector2i(2,1), Vector2i(2,2)]
const upper_z_rot1 = [Vector2i(0,2), Vector2i(1,0), Vector2i(1,1), Vector2i(1,2), Vector2i(2,0)]
const upper_z = [upper_z_rot0, upper_z_rot1, upper_z_rot0, upper_z_rot1]

const TOTAL_ROTATIONS = 4
const SHAPES = [upper_i, upper_l, square, u, lowwer_z, lower_i, upper_z]



