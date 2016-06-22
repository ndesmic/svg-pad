var svgToCanvas = (function(){
	var canvas;
	var context;
	var assets = {};

	function svgToCanvas(svgString){
		var svgDom = htmlParser(svgString);
		var svgEl = svgDom.childNodes[0];
		canvas = document.createElement("canvas");
		assets = {};

		drawSvg(svgEl);

		return canvas;
	}

	function htmlParser(xmlString){
		var parser = new DOMParser();
		return parser.parseFromString(xmlString, "text/xml");
	}

	function drawSvg(svgEl){
		context = canvas.getContext("2d");
		canvas.setAttribute("height", getAttr(svgEl, "height"));
		canvas.setAttribute("width", getAttr(svgEl, "width"));

		drawSvgElement(svgEl);
	}

	function drawSvgElement(svgEl, clip){
		switch(svgEl.nodeName){
			case "#text":
				break;
			case "text":
				drawAtomic(drawText, svgEl);
				break;
			case "svg":
				drawAtomic(drawSvgNode, svgEl);
				break;
			case "line":
				drawAtomic(drawLine, svgEl);
				break;
			case "polygon":
				drawAtomic(drawPolygon, svgEl);
				break;
			case "path":
				drawAtomic(drawPath, svgEl);
				break;
			case "rect":
				drawAtomic(drawRectangle, svgEl);
				break;
			case "circle":
				drawAtomic(drawCircle, svgEl);
				break;
			case "ellipse":
				drawAtomic(drawEllipse, svgEl);
				break;
			case "clipPath":
				assets = getClipPath(svgEl);
				break;
			case "g":
				drawAtomic(drawG, svgEl);
				break;
			default:
				console.error("No implementation for element: " + svgEl.nodeName)
		}
	}

	function drawSvgNode(svgEl){
		for(var i = 0; i < svgEl.childNodes.length; i++){
			var el = svgEl.childNodes[i];
			drawSvgElement(el);
		}
	}

	function drawAtomic(drawFunc){
		context.save();
		drawFunc.apply(this, Array.prototype.slice.call(arguments, 1));
		context.restore();
	}

	function drawText(svgEl){
		var attrs = getMainAttrs(svgEl);
		attrs.x = getAttr(svgEl, "x");
		attrs.y = getAttr(svgEl, "y");
		attrs.font = getFont(svgEl);

		context.font = attrs.font;
		context.fillText(svgEl.textContent, attrs.x, attrs.y);
		if(attrs.stroke){
			context.strokeText(svgEl.textContent, attrs.x, attrs.y);
		}
	}

	function getFont(svgEl){
		var fontFamily = getAttr(svgEl, "font-family") || svgEl.style["font-family"] || "Times New Roman";
		var fontSize = getAttr(svgEl, "font-size") || svgEl.style["font-size"] || "16px";
		return fontSize + " " + fontFamily;
	}

	function drawLine(svgEl){
		var attrs = getMainAttrs(svgEl);
		attrs.x1 = getAttr(svgEl, "x1");
		attrs.x2 = getAttr(svgEl, "x2");
		attrs.y1 = getAttr(svgEl, "y1");
		attrs.y2 = getAttr(svgEl, "y2");
		attrs.clipPathUrl = getUrlAttr(svgEl, "clip-path");

		setContextMainAttrs(attrs);

		if(attrs.clipPathUrl){
			clip(svgEl, clipPathUrl);
		}

		context.beginPath();
		context.moveTo(attrs.x1, attrs.y1);
		context.lineTo(attrs.x2, attrs.y2);

		strokeAndFill(attrs);
	}

	function drawPolygon(svgEl){
		var X = 0;
		var Y = 1;
		var attrs = getMainAttrs(svgEl);
		attrs.rawPoints = getAttr(svgEl, "points");
		var points = parsePoints(attrs.rawPoints);

		setContextMainAttrs(attrs);

		context.beginPath();
		context.moveTo(points[0][X], points[0][Y]);

		for(var i = 1; i < points.length; i++){
			context.lineTo(points[i][X], points[i][Y]);
		}

		context.closePath();

		strokeAndFill(attrs);
	}

	function parsePoints(pointsString){
		var rawList = pointsString.split(" ");
		var pointsList = [];

		for(var i = 0; i < rawList.length; i++){
			var point = rawList[i].split(",");
			pointsList.push(point);
		}

		return pointsList;
	}

	function drawPath(svgEl){

	}

	function drawG(svgEl){
		for(var i = 0; i < svgEl.childNodes.length; i++){
			var el = svgEl.childNodes[i];
			drawSvgElement(el);
		}
	}

	function drawRectangle(svgEl, clip){
		var attrs = getMainAttrs(svgEl);
		attrs.x = getAttr(svgEl, "x");
		attrs.y = getAttr(svgEl, "y");
		attrs.height = getAttr(svgEl, "height");
		attrs.width = getAttr(svgEl, "width");

		setContextMainAttrs(attrs);

		context.rect(attrs.x, attrs.y, attrs.width, attrs.height);

		if(!clip){
			strokeAndFill(attrs);
		}
	}

	function drawCircle(svgEl, clip){
		var attrs = getMainAttrs(svgEl);
		attrs.cx = getAttr(svgEl, "cx");
		attrs.cy = getAttr(svgEl, "cy");
		attrs.r = getAttr(svgEl, "r");

		setContextMainAttrs(attrs);

		context.beginPath();
		context.arc(attrs.cx, attrs.cy, attrs.r, 0, Math.PI*2, true);
		context.closePath();

		strokeAndFill(attrs);
	}

	function drawEllipse(svgEl){
		var attrs = getMainAttrs(svgEl);
		attrs.cx = getAttr(svgEl, "cx");
		attrs.cy = getAttr(svgEl, "cy");
		attrs.rx = getAttr(svgEl, "rx");
		attrs.ry = getAttr(svgEl, "ry");

		setContextMainAttrs(attrs);
		drawOval(attrs.cx, attrs.cy, attrs.rx, attrs.ry);
		strokeAndFill(attrs);
	}

	function drawOval(cx, cy, rx, ry){
        context.beginPath();
        context.translate(cx-rx, cy-ry);
        context.scale(rx, ry);
        context.arc(1, 1, 1, 0, 2 * Math.PI, false);
	}

	function getAttr(el, name){
		var attr = el.attributes[name]
		if(attr){
			return attr.value;
		}
		if(el.style && el.style[name]){
			return el.style[name];
		}
		return null;
	}

	function getUrlAttr(el, name){
		var attr = getAttr(el, name);
		if(attr){
			attr = attr.replace(/url\(/, "");
			attr = attr.replace(")", "");
		}
		return attr;
	}

	function getClipPath(svgEl){
		assets.clipPaths = assets.clipPaths || {};
		assets.clipPaths[svgEl.id] = svgEl.childNodes;
		return assets;
	}

	function urlToId(url){
		return url.substr(1);
	}

	function strokeAndFill(attrs){
		if(attrs.fill){
			context.fill();
		}
		if(attrs.stroke){
			context.stroke();
		}
	}

	function getMainAttrs(svgEl){
		return {
			stroke : getAttr(svgEl, "stroke"),
			strokeWidth : getAttr(svgEl, "stroke-width"),
			fill : getAttr(svgEl, "fill")
		};
	}

	function setContextMainAttrs(attrs){
		context.lineWidth = attrs.strokeWidth;
		context.strokeStyle = attrs.stroke;
		context.fillStyle = attrs.fill;
	}

	function clip(svgEl, clipPathUrl){
		if(clipPathUrl){
			var clipPathId = urlToId(clipPathUrl);
			var clipAsset = assets.clipPaths[clipPathId];
			context.beginPath();
			for(var i = 0; i < clipAsset.length; i++){
				drawSvgElement(clipAsset[i], clip);
			}
			context.clip();
		}
	}

	return {
		svgToCanvas : svgToCanvas
	}

})();


var svgPath = (function(){

	var controlChars = ["M", "m", "L", "l", "H", "h", "V", "v",	"C", "c", "Z", "z", "S", "s", "Q", "q", "T", "t", "A", "a"];

	function drawPath(pathData){
		var path = parsePath(pathData);
	}

	function isControlChar(char){
		return controlChars.indexOf(char) != -1;
	}
	function partContainsControlChar(part){
		return isControlChar(part.charAt(0));
	}

	function parsePath(pathData){
		var pathDataParts = pathData.split(" ");
		var pathInstructions = [];
		var partIndex = 0;

		while(partIndex < pathDataParts.length){
			var pathPart = pathDataParts[partIndex].trim();

			if(partContainsControlChar(pathPart)){
				var instruction = {};
				instruction.instruction = pathPart.charAt(0);
				instruction.points = [];
				if(pathPart.length > 1){
					instruction.points.push(pathPart.substr(1));
				}
				while(partIndex + 1 < pathDataParts.length && !partContainsControlChar(pathDataParts[partIndex + 1])){
					partIndex++;
					pathPart = pathDataParts[partIndex];
					instruction.points.push(pathPart);
				}
				pathInstuctions.push(instruction);
			}else{
				console.log("unexpected part:", pathPart)
			}
			partIndex++;
		}

		return pathInstructions;
	}

	return {
		drawPath : drawPath,
		_parsePath : parsePath
	};

})();
