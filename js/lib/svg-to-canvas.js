var SvgToCanvas = (function() {

	const defaults = {
		canvas: null //required
	};

	function create(options) {
		let svgToCanvas = {};
		svgToCanvas.options = Object.assign({}, defaults, options);
		bind(svgToCanvas);
		svgToCanvas.init();
		return svgToCanvas;
	}

	function bind(svgToCanvas) {
		svgToCanvas.render = render.bind(svgToCanvas);
		svgToCanvas.init = init.bind(svgToCanvas);
    svgToCanvas.drawAtomic = drawAtomic.bind(svgToCanvas);
    svgToCanvas.drawElement = drawElement.bind(svgToCanvas);
    svgToCanvas.drawContainer = drawContainer.bind(svgToCanvas);
    svgToCanvas.drawPath = drawPath.bind(svgToCanvas);
    svgToCanvas.drawText = drawText.bind(svgToCanvas);
    svgToCanvas.drawLine = drawLine.bind(svgToCanvas);
    svgToCanvas.drawRectangle = drawRectangle.bind(svgToCanvas);
    svgToCanvas.drawPolygon = drawPolygon.bind(svgToCanvas);
    svgToCanvas.drawEllipse = drawEllipse.bind(svgToCanvas);
    svgToCanvas.drawCircle = drawCircle.bind(svgToCanvas);
    svgToCanvas.drawOval = drawOval.bind(svgToCanvas);
    svgToCanvas.clip = clip.bind(svgToCanvas);
	}

	function init() {
		const canvas = this.options.canvas || document.createElement("canvas");
		this.svgPathParser = SvgPathParser.create();
		this.instructionSimplifier = InstructionSimplifier.create();
		this.canvasRenderer = CanvasRenderer.create({
			canvas
		});
	}

	function render(svgText) {
		const svgDoc = parseXml(svgText);
		const svgElement = svgDoc.childNodes[0];
		const context = this.canvasRenderer.context;
		const canvas = context.canvas;
		canvas.setAttribute("height", getAttr(svgElement, "height"));
		canvas.setAttribute("width", getAttr(svgElement, "width"));

		this.drawElement(svgElement, {
			document: svgDoc,
			context: context,
			defs: {
				clipPaths: {}
			}
		});

		return canvas;
	}

	function drawElement(element, scope) {
		switch (element.nodeName) {
			case "defs":
			case "svg":
			case "g":
				this.drawAtomic(this.drawContainer, element, scope);
				break;
			case "#text":
				break;
			case "text":
				this.drawAtomic(drawText, element, scope);
				break;
			case "line":
				this.drawAtomic(drawLine, element, scope);
				break;
			case "polygon":
				this.drawAtomic(drawPolygon, element, scope)
				break;
			case "path":
				this.drawAtomic(this.drawPath, element, scope);
				break;
			case "rect":
				this.drawAtomic(drawRectangle, element, scope);
				break;
			case "circle":
				this.drawAtomic(drawCircle, element, scope);
				break;
			case "ellipse":
				this.drawAtomic(drawEllipse, element, scope);
				break;
			case "clipPath":
				const clipPath = getAsClipPath(element);
				scope.defs.clipPaths[clipPath.id] = clipPath.elements;
				break;
			default:
				console.error("No implementation for element: " + element.nodeName)
		}
	}

	function drawAtomic(drawFunc, element, scope) {
		const clipPath = getUrlAttr(element, "clip-path");
		scope.context.save();
		if (clipPath) {
			this.clip(scope.defs.clipPaths[clipPath], scope);
		}
		drawFunc.call(this, element, scope);
		scope.context.restore();
	}

	function getAsClipPath(element) {
		return {
			id: element.id,
			elements: element.childNodes
		};
	}

	function getAttrs(element, attributeNames = []) {
		let attrs = {
			stroke: getAttr(element, "stroke"),
			strokeWidth: getAttr(element, "stroke-width"),
			fill: getAttr(element, "fill"),
			clipPath: getUrlAttr(element, "clip-path")
		};
		for (let attrName of attributeNames) {
			attrs[attrName] = getAttr(element, attrName);
		}
		return attrs;
	}

	function getAttr(element, name) {
		var attr = element.attributes[name]
		if (attr) {
			return attr.value;
		}
		if (element.style && element.style[name]) {
			return element.style[name];
		}
		return null;
	}

	function getUrlAttr(element, name) {
		var attr = getAttr(element, name);
		if (attr) {
			attr = attr.replace(/url\(/, "");
			attr = attr.replace(")", "");
			attr = attr.replace(/^#/, "");
		}
		return attr;
	}

	function getFont(element) {
		const fontFamily = getAttr(element, "font-family") || element.style["font-family"] || "Times New Roman";
		const fontSize = getAttr(element, "font-size") || element.style["font-size"] || "16px";
		return fontSize + " " + fontFamily;
	}

	function setContext(context, attrs) {
		context.lineWidth = attrs.strokeWidth;
		context.strokeStyle = attrs.stroke;
		context.fillStyle = attrs.fill;
	}

	function parseXml(xmlString) {
		let parser = new DOMParser();
		return parser.parseFromString(xmlString, "text/xml");
	}

	function parsePoints(pointsString) {
		var rawList = pointsString.split(" ");
		var pointsList = [];

		for (var i = 0; i < rawList.length; i++) {
			var point = rawList[i].split(",");
			pointsList.push(point);
		}

		return pointsList;
	}

	function strokeAndFill(attrs, scope) {
		if (attrs.fill) {
			scope.context.fill();
		}
		if (attrs.stroke) {
			scope.context.stroke();
		}
	}

	function clip(clipPath, scope) {
		scope.context.beginPath();
		for (let element of clipPath) {
			this.drawElement(element, scope);
		}
		scope.context.clip();
	}

	function drawContainer(element, scope) {
		const attrs = getAttrs(element);
		if (attrs.clipPath) {
			this.clip(scope.defs.clipPaths[attrs.clipPath], scope);
		}
		for (var i = 0; i < element.childNodes.length; i++) {
			var el = element.childNodes[i];
			this.drawElement(el, scope);
		}
	}

	function drawRectangle(element, scope) {
		const attrs = getAttrs(element, ["x", "y", "height", "width"]);
		setContext(scope.context, attrs);

		scope.context.rect(attrs.x, attrs.y, attrs.width, attrs.height);
		strokeAndFill(attrs, scope);
	}

	function drawPolygon(element, scope) {
		const attrs = getAttrs(element, ["points"]);
		const points = parsePoints(attrs.points);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.moveTo(points[0][0], points[0][1]);

		for (let i = 1; i < points.length; i++) {
			scope.context.lineTo(points[i][0], points[i][1]);
		}

		scope.context.closePath();
		strokeAndFill(attrs, scope);
	}

	function drawCircle(element, scope) {
		const attrs = getAttrs(element, ["cx", "cy", "r"]);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.arc(attrs.cx, attrs.cy, attrs.r, 0, Math.PI * 2, true);
		scope.context.closePath();

		strokeAndFill(attrs, scope);
	}

	function drawEllipse(element, scope) {
		const attrs = getAttrs(element, ["cx", "cy", "rx", "ry"]);
		setContext(scope.context, attrs);
		drawOval(attrs.cx, attrs.cy, attrs.rx, attrs.ry, scope);
		strokeAndFill(attrs, scope);
	}

	function drawOval(cx, cy, rx, ry, scope) {
		scope.context.beginPath();
		scope.context.translate(cx - rx, cy - ry);
		scope.context.scale(rx, ry);
		scope.context.arc(1, 1, 1, 0, 2 * Math.PI, false);
	}

	function drawLine(element, scope) {
		const attrs = getAttrs(element, ["x1", "x2", "y1", "y2"]);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.moveTo(attrs.x1, attrs.y1);
		scope.context.lineTo(attrs.x2, attrs.y2);

		strokeAndFill(attrs, scope);
	}

	function drawText(element, scope) {
		const attrs = getAttrs(elements, ["x", "y"]);
		attrs.font = getFont(element);
		scope.context.font = attrs.font;
		scope.context.fillText(element.textContent, attrs.x, attrs.y);
		if (attrs.stroke) {
			context.strokeText(element.textContent, attrs.x, attrs.y);
		}
	}

	function drawPath(element, scope) {
		const attrs = getAttrs(element, ["d"]);
		let instructionList = this.svgPathParser.parsePath(attrs.d);
		instructionList = this.instructionSimplifier.simplifyInstructions(instructionList);
		this.canvasRenderer.drawInstructionList(instructionList, {
			strokeColor: attrs.stroke,
			strokeWidth: attrs.strokeWidth,
			fillColor: attrs.fill
		});
	}

	return {
		create
	};

})();
