export function flipAcrossX(instruction, origin){
	switch(instruction.type){
		case "verticalLineAbsolute":
		case "verticalLineRelative":
			return { type: instruction.type, points: [origin - (instruction.points[0] - origin)] }
		case "moveAbsolute": 
		case "moveRelative":
		case "lineAbsolute":
			return { type: instruction.type, points: [instruction.points[0], origin - (instruction.points[1] - origin)] };
		case "lineRelative":
		case "horizontalLineAbsolute":
		case "horizontalLineRelative":
		case "closePath":
			return { type: instruction.type, points: instruction.points };
		case "cubicCurveAbsolute":
		case "cubicCurveRelative":
			return { type: instruction.type, points: [
				instruction.points[0],
				origin - (instruction.points[1] - origin),
				instruction.points[2],
				origin - (instruction.points[3] - origin),
				instruction.points[4],
				origin - (instruction.points[5] - origin),
			]};
		case "S":
		case "s":
		case "Q":
		case "q":
		case "T":
		case "t":
		case "A":
		case "a":
	}
}