# Shape definitions using (x,y) coordinate tuples
upper_l_rot0 = [(0,1), (1,1), (2,1)]
upper_l_rot1 = [(0,2), (1,1), (2,0)]
upper_l_rot2 = [(1,0), (1,1), (1,2)]
upper_l_rot3 = [(0,0), (1,1), (2,2)]
upper_l = [upper_l_rot0, upper_l_rot1, upper_l_rot2, upper_l_rot3]

square_rot0 = [(0,0), (0,1), (1,0), (1,1)]
square = [square_rot0, square_rot0, square_rot0, square_rot0]

upper_i_rot0 = [(1,0), (1,1), (1,2)]
upper_i_rot1 = [(0,2), (1,1), (2,0)]
upper_i_rot2 = [(0,1), (1,1), (2,1)]
upper_i_rot3 = [(0,0), (1,1), (2,2)]
upper_i = [upper_i_rot0, upper_i_rot1, upper_i_rot2, upper_i_rot3]

u_rot3 = [(0,0), (0,1), (0,2), (1,0), (1,2)]
u_rot2 = [(0,1), (0,2), (1,2), (2,1), (2,2)]
u_rot1 = [(1,0), (1,2), (2,0), (2,1), (2,2)]
u_rot0 = [(0,0), (0,1), (1,0), (2,0), (2,1)]
u = [u_rot0, u_rot1, u_rot2, u_rot3]

lower_z_rot0 = [(0,0), (0,1), (1,1), (1,2)]
lower_z_rot1 = [(0,1), (1,0), (1,1), (2,0)]
lower_z = [lower_z_rot0, lower_z_rot1, lower_z_rot0, lower_z_rot1]

lower_i_rot0 = [(0,0), (0,1)]
lower_i_rot1 = [(0,1), (1,0)]
lower_i_rot2 = [(0,0), (1,0)]
lower_i_rot3 = [(0,0), (1,1)]
lower_i = [lower_i_rot0, lower_i_rot1, lower_i_rot2, lower_i_rot3]

upper_z_rot0 = [(0,0), (0,1), (1,1), (2,1), (2,2)]
upper_z_rot1 = [(0,2), (1,0), (1,1), (1,2), (2,0)]
upper_z = [upper_z_rot0, upper_z_rot1, upper_z_rot0, upper_z_rot1]

TOTAL_ROTATIONS = 4
SHAPES_DICT = {
    "upper_i": upper_i,
    "upper_l": upper_l,
    "square": square,
    "u": u,
    "lower_z": lower_z,
    "lower_i": lower_i,
    "upper_z": upper_z
}

