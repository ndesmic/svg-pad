const controlChars = {
	"M": "moveAbsolute",
	"m": "moveRelative",
	"L": "lineAbsolute",
	"l": "lineRelative",
	"H": "horizontalLineAbsolute",
	"h": "horizontalLineRelative",
	"V": "verticalLineAbsolute",
	"v": "verticalLineRelative",
	"C": "cubicCurveAbsolute",
	"c": "cubicCurveRelative",
	"Z": "closePath",
	"z": "closePath",
	"S": "curveSmoothAbsolute",
	"s": "curveSmoothRelative",
	"Q": "quadraticAbsolute",
	"q": "quadraticRelative",
	"T": "quadraticSmoothAbsolute",
	"t": "quadraticSmoothRelative",
	"A": "arcAbsolute",
	"a": "arcRelative"
};

export class SvgPathParser {

	constructor() {
		this.bind(this);
	}

	bind(svgPathParser) {
		svgPathParser.parsePath = this.parsePath.bind(svgPathParser);
		svgPathParser.tokenizePath = this.tokenizePath.bind(svgPathParser);
	}

	tokenizePath(pathData){
		return pathData.match(/[a-zA-Z]+|[0-9|\.|-]+/g);
	}

	parsePath(pathData) {
		const tokens = this.tokenizePath(pathData);
		const instructions = [];
		let i = 0;

		while(i < tokens.length){
			const currentToken = tokens[i];

			if(isControlChar(tokens[i])){
				const points = [];
				let offset = 1;
				while(i + offset < tokens.length && !isControlChar(tokens[i + offset])){
					points.push(parseFloat(tokens[i + offset]));
					offset++;
				}
				instructions.push({ type: controlChars[currentToken], points });
				i += offset;
			} else {
				i++;
			}
		}

		return instructions;
	}

	isControlChar(char){	
		return Object.keys(controlChars).includes(char);
	}
}