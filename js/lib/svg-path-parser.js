const SvgPathParser = (function(){

	const defaults = {
		canvas : null
	};

	const controlChars = {
		"M" : "moveAbsolute",
		"m" : "moveRelative",
		"L" : "lineAbsolute",
		"l" : "lineRelative",
		"H" : "horizontalLineAbsolute",
		"h" : "horizontalLineRelative",
		"V" : "verticalLineAbsolute",
		"v" : "verticalLineRelative",
		"C" : "cubicCurveAbsolute",
		"c" : "cubicCurveRelative",
		"Z" : "closePath",
		"z" : "closePath",
		"S" : "curveSmoothAbsolute",
		"s" : "curveSmoothRelative",
		"Q" : "quadraticAbsolute",
		"q" : "quadraticRelative",
		"T" : "quadraticSmoothAbsolute",
		"t" : "quadraticSmoothRelative",
		"A" : "arcAbsolute",
		"a" : "arcRelative"
	};

	function create(options){
		let svgPath = {};
		svgPath.options = Object.assign({}, defaults, options);
		bind(svgPath);
		return svgPath;
	}

	function bind(svgPath){
		svgPath.parsePath = parsePath.bind(svgPath);
	}

	function parsePath(pathData){
		let pathDataParts = splitWhitespace(pathData);
		let pathInstructions = [];
		let partIndex = 0;

		while(partIndex < pathDataParts.length){
			let pathPart = pathDataParts[partIndex].trim();

			if(partContainsControlChar(pathPart)){
				let instruction = {
				      type : controlChars[pathPart.charAt(0)],
				      points : []
        };
				if(pathPart.length > 1){
					instruction.points = pathPart.substr(1).split(",").map(x => parseFloat(x)).filter(x => !isNaN(x));
				}
				while(partIndex + 1 < pathDataParts.length && !partContainsControlChar(pathDataParts[partIndex + 1])){
					partIndex++;
					pathPart = pathDataParts[partIndex];
					instruction.points.push(pathPart);
				}
				pathInstructions.push(instruction);
			}else{
				console.log("unexpected part:", pathPart)
			}
			partIndex++;
		}

		return pathInstructions;
	}
	function isWhitespace(char){
  		const whitespace = [
			String.fromCharCode(13), //carriage return
			String.fromCharCode(10), //new line
			String.fromCharCode(32), //space
			String.fromCharCode(9)   //tab
  		];
  		return whitespace.indexOf(char) != -1;
	}
	function splitWhitespace(text){
		let split = [];
		let buffer = "";
		let quoted = false;
		let readWhitespace = false;

    text = text.trim();
		for(let i = 0; i < text.length; i++){
			if(isWhitespace(text[i]) && !quoted && !readWhitespace){
				split.push(buffer);
				buffer = "";
				readWhitespace = true;
			}else if(isWhitespace(text[i]) && !quoted && readWhitespace){
		  		continue;
			}else if(text[i] == "\"" && !quoted){
		  		quoted = true;
		  		readWhitespace = false;
			}else if(text[i] == "\"" && quoted){
		  		quoted = false;
		  		readWhitespace = false;
			}else{
		  		buffer += text[i];
		  		readWhitespace = false;
			}
	  }
	  if(buffer){
		  split.push(buffer);
	  }

	  return split;
	}

	function isControlChar(char){
		return Object.keys(controlChars).indexOf(char) != -1;
	}
	function partContainsControlChar(part){
		return isControlChar(part.charAt(0));
	}

	return {
		create
	};

})();
