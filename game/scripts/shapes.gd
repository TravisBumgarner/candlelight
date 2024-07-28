class_name Shapes

const l_0 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_90 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_180 := [Vector2i(0,1), Vector2i(1,1), Vector2i(2,1)]
const l_270 := [Vector2i(1,0), Vector2i(1,1), Vector2i(1,2)]
const l_preview = {
	"vectors": [Vector2i(0, 0), Vector2i(1, 0), Vector2i(2,0)],
	"height": 1
}
const l := {
	"rotations": [l_0, l_90, l_180, l_270],
	"preview": l_preview
}

const r_0 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_90 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_180 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_270 := [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)]
const r_preview = {
	"vectors": [Vector2i(0,0), Vector2i(0,1), Vector2i(1,0), Vector2i(1,1)],
	"height": 2
} 
const r:= {
	"rotations":[r_0, r_90, r_180, r_270],
	"preview": r_preview
}

const SHAPES := [l, r]

