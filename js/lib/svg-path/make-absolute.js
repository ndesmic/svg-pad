export function makeAbsolute(instructions) {
	const absoluteInstructions = [];
	let currentPoint = [0, 0];
	for (let instruction of instructions) {
		let absoluteInstruction;
		switch (instruction.type) {
			case "moveRelative": {
				absoluteInstruction = {
					type: "moveAbsolute",
					points: [currentPoint[0] + instruction.points[0], currentPoint[1] + instruction.points[1]]
				};
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "lineRelative": {
				absoluteInstruction = {
					type: "lineAbsolute",
					points: [currentPoint[0] + instruction.points[0], currentPoint[1] + instruction.points[1]]
				};
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "moveAbsolute": {
				absoluteInstruction = {
					type: "moveAbsolute",
					points: [...instruction.points]
				}
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "lineAbsolute": {
				absoluteInstruction = {
					type: "lineAbsolute",
					points: [...instruction.points]
				}
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "horizontalLineRelative": {
				absoluteInstruction = {
					type: "horizontalLineAbsolute",
					points: [currentPoint[0] + instruction.points[0]]
				};
				currentPoint = [absoluteInstruction.points[0], currentPoint[1]];
				break;
			}
			case "horizontalLineAbsolute": {
				absoluteInstruction = {
					type: "horizontalLineAbsolute",
					points: [instruction.points[0]]
				}
				currentPoint = [absoluteInstruction.points[0], currentPoint[1]];
				break;
			}
			case "verticalLineRelative": {
				absoluteInstruction = {
					type: "verticalLineAbsolute",
					points: [currentPoint[1] + instruction.points[0]]
				};
				currentPoint = [currentPoint[0], absoluteInstruction.points[0]];
				break;
			}
			case "verticalLineAbsolute": {
				absoluteInstruction = {
					type: "verticalLineAbsolute",
					points: [instruction.points[0]]
				};
				currentPoint = [currentPoint[0], absoluteInstruction.points[0]];
				break;
			}
			case "cubicCurveRelative": {
				absoluteInstruction = {
					type: "cubicCurveAbsolute",
					points: [currentPoint[0] + instruction.points[0], currentPoint[1] + instruction.points[1], currentPoint[0] + instruction.points[2], currentPoint[1] + instruction.points[3], currentPoint[0] + instruction.points[4], currentPoint[1] + instruction.points[5]]
				};
				currentPoint = [absoluteInstruction.points[4], absoluteInstruction.points[5]];
				break;
			}
			case "cubicCurveAbsolute": {
				absoluteInstruction = {
					type: "cubicCurveAbsolute",
					points: [...instruction.points]
				};
				currentPoint = [absoluteInstruction.points[4], absoluteInstruction.points[5]];
				break;
			}
			case "smoothCurveRelative": {
				absoluteInstruction = {
					type: "smoothCurveAbsolute",
					points: [currentPoint[0] + instruction.points[0], currentPoint[1] + instruction.points[1], currentPoint[0] + instruction.points[2], currentPoint[1] + instruction.points[3]],
				}
				currentPoint = [absoluteInstruction.points[2], absoluteInstruction.points[3]];
				break;
			}
			case "smoothCurveAbsolute": {
				absoluteInstruction = {
					type: "smoothCurveAbsolute",
					points: [...instruction.points]
				};
				currentPoint = [absoluteInstruction.points[2], absoluteInstruction.points[3]];
				break;
			}
			case "quadraticCurveRelative": {
				absoluteInstruction = {
					type: "quadraticCurveAbsolute",
					points: [currentPoint[0] + instruction.points[0], currentPoint[1] + instruction.points[1], currentPoint[0] + instruction.points[2], currentPoint[1] + instruction.points[3]],
				}
				currentPoint = [absoluteInstruction.points[2], absoluteInstruction.points[3]];
				break;
			}
			case "quadraticCurveAbsolute": {
				absoluteInstruction = {
					type: "quadraticCurveAbsolute",
					points: [...instruction.points]
				};
				currentPoint = [absoluteInstruction.points[2], absoluteInstruction.points[3]];
				break;
			}
			case "smoothQuadraticRelative": {
				absoluteInstruction = {
					type: "smoothQuadraticAbsolute",
					points: [currentPoint[0] + instruction.points[0], currentPoint[1] + instruction.points[1]],
				}
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "smoothQuadraticAbsolute": {
				absoluteInstruction = {
					type: "smoothQuadraticAbsolute",
					points: [...instruction.points]
				};
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "arcRelative": {
				absoluteInstruction = {
					type: "arcAbsolute",
					points: [instruction.points[0], instruction.points[1], instruction.points[2], instruction.points[3], instruction.points[4], currentPoint[0] + instruction.points[5], currentPoint[1] + instruction.points[6]],
				}
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "arcAbsolute": {
				absoluteInstruction = {
					type: "arcAbsolute",
					points: [...instruction.points]
				};
				currentPoint = [absoluteInstruction.points[0], absoluteInstruction.points[1]];
				break;
			}
			case "closePath":
				//currentPoint = startingPoint
				break;
		}
		absoluteInstructions.push(absoluteInstruction);
	}
	return absoluteInstructions;
}