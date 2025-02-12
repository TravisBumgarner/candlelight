# Shape definitions using (x,y) coordinate tuples
upper_l_rot0 = [(0,1), (1,1), (2,1)]
upper_l_rot1 = [(0,2), (1,1), (2,0)]
upper_l_rot2 = [(1,0), (1,1), (1,2)]
upper_l_rot3 = [(0,0), (1,1), (2,2)]
upper_l = [upper_l_rot0, upper_l_rot1, upper_l_rot2, upper_l_rot3]

square_rot0 = [(0,0), (0,1), (1,0), (1,1)]
square = [square_rot0, square_rot0, square_rot0, square_rot0]

u_rot3 = [(0,0), (0,1), (0,2), (1,0), (1,2)]
u_rot2 = [(0,1), (0,2), (1,2), (2,1), (2,2)]
u_rot1 = [(1,0), (1,2), (2,0), (2,1), (2,2)]
u_rot0 = [(0,0), (0,1), (1,0), (2,0), (2,1)]
u = [u_rot0, u_rot1, u_rot2, u_rot3]

lower_z_rot0 = [(0,0), (0,1), (1,1), (1,2)]
lower_z_rot1 = [(0,1), (1,0), (1,1), (2,0)]
lower_z = [lower_z_rot0, lower_z_rot1, lower_z_rot0, lower_z_rot1]

upper_z_rot0 = [(0,0), (0,1), (1,1), (2,1), (2,2)]
upper_z_rot1 = [(0,2), (1,0), (1,1), (1,2), (2,0)]
upper_z = [upper_z_rot0, upper_z_rot1, upper_z_rot0, upper_z_rot1]

w_rot3 = [(0,0), (1,0), (1,1), (2,1), (2,2)]
w_rot2 = [(0,2), (0,1), (1,1), (1,0), (2,0)]
w_rot1 = [(2,2), (1,2), (1,1), (0,1), (0,0)]
w_rot0 = [(2,0), (2,1), (1,1), (1,2), (0,2)]
w = [w_rot0, w_rot1, w_rot2, w_rot3]

t_rot3 = [(0,0), (1,0), (1,1), (1,2), (2,0)]
t_rot2 = [(0,2), (0,1), (1,1), (2,1), (0,0)]
t_rot1 = [(2,2), (1,2), (1,1), (1,0), (0,2)]
t_rot0 = [(2,0), (2,1), (1,1), (0,1), (2,2)]
t = [t_rot0, t_rot1, t_rot2, t_rot3]

TOTAL_ROTATIONS = 4
SHAPES_DICT = {
    "upper_l": upper_l,
    "square": square,
    "u": u,
    "lower_z": lower_z,
    "upper_z": upper_z,
    "w": w,
    "t": t
}

