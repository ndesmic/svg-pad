var SvgPath = (function(){

	var defaults = {
		canvas : null
	}

	var controlChars = {
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
		var svgPath = {};
		svgPath.options = Object.assign({}, defaults, options);
		bind(svgPath);
		return svgPath;
	}

	function bind(svgPath){
		svgPath.parsePath = parsePath.bind(svgPath);
	}

	function parsePath(pathData){
		var pathDataParts = splitWhitespace(pathData);
		var pathInstructions = [];
		var partIndex = 0;

		while(partIndex < pathDataParts.length){
			var pathPart = pathDataParts[partIndex].trim();

			if(partContainsControlChar(pathPart)){
				var instruction = {};
				instruction.type = controlChars[pathPart.charAt(0)];
				instruction.points = [];
				if(pathPart.length > 1){
					instruction.points = pathPart.substr(1).split(",").map(x => parseFloat(x));
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
  		var whitespace = [
			String.fromCharCode(13), //carriage return
			String.fromCharCode(10), //new line
			String.fromCharCode(32), //space
			String.fromCharCode(9)   //tab
  		];
  		return whitespace.indexOf(char) != -1;
	}
	function splitWhitespace(text){
		var split = [];
		var buffer = "";
		var quoted = false;
		var readWhitespace = false;
		for(var i = 0; i < text.length; i++){
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
		create : create
	};

})();
