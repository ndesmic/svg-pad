export class SvgRenderer {

	constructor(svg = null) {
		this.bind(this);
		this.svg = svg || document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.svg.appendChild(this.path);
		this.pathSegments = [];
		this.currentPoint = {
			x: 0,
			y: 0
		};
	}

	bind(svgRenderer) {
		svgRenderer.drawInstructionList = this.drawInstructionList.bind(svgRenderer);
	}

	drawInstructionList(pathInstructions) {
		for (let instruction of pathInstructions) {
			switch(instruction.type){
				case "moveAbsolute":
					this.pathSegments.push(`M${instruction.points[0]} ${instruction.points[1]}`);
					break;
				case "moveRelative":
					this.pathSegments.push(`m${instruction.points[0]} ${instruction.points[1]}`);
					break;
				case "lineAbsolute":
					this.pathSegments.push(`L${instruction.points[0]} ${instruction.points[1]}`);
					break;
				case "lineRelative":
					this.pathSegments.push(`l${instruction.points[0]} ${instruction.points[1]}`);
					break;
				case "horizontalLineAbsolute":
					this.pathSegments.push(`H${instruction.points[0]}`);
					break;
				case "horizontalLineRelative":
					this.pathSegments.push(`h${instruction.points[0]}`);
					break;
				case "verticalLineAbsolute":
					this.pathSegments.push(`V${instruction.points[0]}`);
					break;
				case "verticalLineRelative":
					this.pathSegments.push(`v${instruction.points[0]}`);
					break;
				case "closePath":
					this.pathSegments.push(`Z`);
					break;
				case "cubicCurveAbsolute":
					this.pathSegments.push(`C${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]} ${instruction.points[4]} ${instruction.points[5]}`);
					break;
				case "cubicCurveRelative":
					this.pathSegments.push(`c${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]} ${instruction.points[4]} ${instruction.points[5]}`);
					break;
				case "smoothCurveAbsolute":
					this.pathSegments.push(`S${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]}`);
					break;
				case "smoothCurveRelative":
					this.pathSegments.push(`s${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]}`);
					break;
				case "quadraticCurveAbsolute":
					this.pathSegments.push(`Q${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]}`);
					break;
				case "quadraticCurveRelative":
					this.pathSegments.push(`q${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]}`);
					break;
				case "smoothQuadraticAbsolute":
					this.pathSegments.push(`T${instruction.points[0]} ${instruction.points[1]}`);
					break;
				case "smooothQuadraticRelative":
					this.pathSegments.push(`t${instruction.points[0]} ${instruction.points[1]}`);
					break;
				case "arcAbsolute":
					this.pathSegments.push(`A${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]} ${instruction.points[4]} ${instruction.points[5]} ${instruction.points[6]}`);
					break;
				case "arcRelative":
					this.pathSegments.push(`a${instruction.points[0]} ${instruction.points[1]} ${instruction.points[2]} ${instruction.points[3]} ${instruction.points[4]} ${instruction.points[5]} ${instruction.points[6]}`);
					break;
				default:
					console.error(`${instruction.type} is not a valid SVG Path instruction.`)
			}
		}
		this.path.setAttribute("d", this.pathSegments.join(" "));
	}
}