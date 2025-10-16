import { Shape } from "@/types";

const upper_l_rot0: Shape = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
];
const upper_l_rot1: Shape = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
];

const upper_l: Shape[] = [
  upper_l_rot0,
  upper_l_rot1,
  upper_l_rot0,
  upper_l_rot1,
];

const square_rot0: Shape = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
];
const square: Shape[] = [square_rot0, square_rot0, square_rot0, square_rot0];

const u_rot3: Shape = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 0 },
  { x: 1, y: 2 },
];
const u_rot2: Shape = [
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];
const u_rot1: Shape = [
  { x: 1, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];
const u_rot0: Shape = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
];
const u: Shape[] = [u_rot0, u_rot1, u_rot2, u_rot3];

const lower_z_rot0: Shape = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
];
const lower_z_rot1: Shape = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 0 },
];
const lower_z: Shape[] = [
  lower_z_rot0,
  lower_z_rot1,
  lower_z_rot0,
  lower_z_rot1,
];

const upper_z_rot0: Shape = [
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];
const upper_z_rot1: Shape = [
  { x: 0, y: 2 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
];
const upper_z: Shape[] = [
  upper_z_rot0,
  upper_z_rot1,
  upper_z_rot0,
  upper_z_rot1,
];

const w_rot3: Shape = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];
const w_rot2: Shape = [
  { x: 0, y: 2 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
];
const w_rot1: Shape = [
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: 0, y: 0 },
];
const w_rot0: Shape = [
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 0, y: 2 },
];
const w: Shape[] = [w_rot0, w_rot1, w_rot2, w_rot3];

const t_rot3: Shape = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
];
const t_rot2: Shape = [
  { x: 0, y: 2 },
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 0, y: 0 },
];
const t_rot1: Shape = [
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: 2 },
];
const t_rot0: Shape = [
  { x: 2, y: 0 },
  { x: 2, y: 1 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: 2, y: 2 },
];
const t: Shape[] = [t_rot0, t_rot1, t_rot2, t_rot3];

export const TOTAL_ROTATIONS = 4;
export const SHAPES_DICT = {
  upper_l: upper_l,
  square: square,
  u: u,
  lower_z: lower_z,
  upper_z: upper_z,
  w: w,
  t: t,
};
