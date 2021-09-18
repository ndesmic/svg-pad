import { parseSvgPoints, parseXml } from "./utilities.js";
import { CanvasRenderer } from "./svg-path/canvas-renderer.js";
import { InstructionSimplifier } from "./svg-path/instruction-simplifier.js";
import { SvgPathParser } from "./svg-path/svg-path-parser.js";

function getAsClipPath(element) {
	return {
		id: element.id,
		elements: element.childNodes
	};
}

function getAttrs(element, attributeNames = []) {
	const attrs = {
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

function getAttr(element, name, defaultValue = null) {
	const attr = element.attributes[name]
	if (attr) {
		return attr.value;
	}
	if (element.style && element.style[name]) {
		return element.style[name];
	}
	return defaultValue;
}

function getUrlAttr(element, name) {
	return getAttr(element, name, "")
					.replace(/url\(/, "")
					   .replace(")", "")
					   .replace(/^#/, "");
}

function getFont(element) {
	const family = getAttr(element, "font-family", "arial");
	const weight = getAttr(element, "font-weight");
	const style = getAttr(element, "font-style");
	let size = getAttr(element, "font-size", "16px");
	if (!isNaN(size)) {
		size = size + "px";
	}
	return [style, weight, size, family]
			.filter(x => x)
			.map(x => x.trim())
			.join(" ");
}

function setContext(context, attrs) {
	context.lineWidth = attrs.strokeWidth;
	context.strokeStyle = attrs.stroke;
	context.fillStyle = attrs.fill;
}

function setCanvasAttributes(canvas, svgElement){
	const height = getAttr(svgElement, "height", 2000);
	const width = getAttr(svgElement, "width", 2000);
	canvas.setAttribute("height", height);
	canvas.setAttribute("width", width);
}

function strokeAndFill(attrs, scope) {
	if (attrs.fill && attrs.fill !== "none") {
		scope.context.fill();
	}
	if (attrs.stroke) {
		scope.context.stroke();
	}
}

function normalizeTextCoordinates(attrs, width){
	switch(attrs["text-anchor"]){
		case "middle" :
			return { ...attrs, ...{ x: (parseFloat(attrs.x) - width/2) } };
		case "end" : 
			return { ...attrs, ...{ x: (parseFloat(attrs.x) - width) } };
		default:
			return attrs;
	}
}

export class SvgToCanvas {

	constructor(canvas) {
		this.canvas = canvas || document.createElement("canvas");
		this.bind(this);

		this.svgPathParser = new SvgPathParser();
		this.instructionSimplifier = new InstructionSimplifier();
		this.canvasRenderer = new CanvasRenderer(this.canvas);
	}

	bind(svgToCanvas) {
		svgToCanvas.render = this.render.bind(svgToCanvas);
		svgToCanvas.drawAtomic = this.drawAtomic.bind(svgToCanvas);
		svgToCanvas.drawElement = this.drawElement.bind(svgToCanvas);
		svgToCanvas.drawContainer = this.drawContainer.bind(svgToCanvas);
		svgToCanvas.drawPath = this.drawPath.bind(svgToCanvas);
		svgToCanvas.drawText = this.drawText.bind(svgToCanvas);
		svgToCanvas.drawLine = this.drawLine.bind(svgToCanvas);
		svgToCanvas.drawRectangle = this.drawRectangle.bind(svgToCanvas);
		svgToCanvas.drawPolygon = this.drawPolygon.bind(svgToCanvas);
		svgToCanvas.drawEllipse = this.drawEllipse.bind(svgToCanvas);
		svgToCanvas.drawCircle = this.drawCircle.bind(svgToCanvas);
		svgToCanvas.drawOval = this.drawOval.bind(svgToCanvas);
		svgToCanvas.clip = this.clip.bind(svgToCanvas);
	}

	render(svgText) {
		const svgDoc = parseXml(svgText);
		const svgElement = svgDoc.childNodes[0];
		const context = this.canvasRenderer.context;
		const canvas = context.canvas;

		setCanvasAttributes(canvas, svgElement);

		this.drawElement(svgElement, {
			document: svgDoc,
			context: context,
			defs: {
				clipPaths: {}
			}
		});

		return canvas;
	}

	drawElement(element, scope) {
		switch (element.nodeName) {
			case "defs":
			case "svg":
			case "g":
				this.drawAtomic(this.drawContainer, element, scope);
				break;
			case "text":
				this.drawAtomic(this.drawText, element, scope);
				break;
			case "line":
				this.drawAtomic(this.drawLine, element, scope);
				break;
			case "polyline":
				this.drawAtomic(this.drawPolyline, element, scope);
				break;
			case "polygon":
				this.drawAtomic(this.drawPolygon, element, scope)
				break;
			case "path":
				this.drawAtomic(this.drawPath, element, scope);
				break;
			case "rect":
				this.drawAtomic(this.drawRectangle, element, scope);
				break;
			case "circle":
				this.drawAtomic(this.drawCircle, element, scope);
				break;
			case "ellipse":
				this.drawAtomic(this.drawEllipse, element, scope);
				break;
			case "clipPath":
				const clipPath = getAsClipPath(element);
				scope.defs.clipPaths[clipPath.id] = clipPath.elements;
				break;
			case "title":
			case "#text":
				return; //no-op, non-visual content
			default:
				console.error("No implementation for element: " + element.nodeName)
		}
	}

	drawAtomic(drawFunc, element, scope) {
		const clipPath = getUrlAttr(element, "clip-path");
		scope.context.save();
		if (clipPath) {
			this.clip(scope.defs.clipPaths[clipPath], scope);
		}
		drawFunc.call(this, element, scope);
		scope.context.restore();
	}

	clip(clipPath, scope) {
		scope.context.beginPath();
		for (let element of clipPath) {
			this.drawElement(element, scope);
		}
		scope.context.clip();
	}

	drawContainer(element, scope) {
		const attrs = getAttrs(element);
		if (attrs.clipPath) {
			this.clip(scope.defs.clipPaths[attrs.clipPath], scope);
		}
		for (var i = 0; i < element.childNodes.length; i++) {
			var el = element.childNodes[i];
			this.drawElement(el, scope);
		}
	}

	drawRectangle(element, scope) {
		const attrs = getAttrs(element, ["x", "y", "height", "width"]);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.rect(attrs.x, attrs.y, attrs.width, attrs.height);
		scope.context.closePath();
		strokeAndFill(attrs, scope);
	}

	drawPolyline(element, scope) {
		const attrs = getAttrs(element, ["points"]);
		const points = parseSvgPoints(attrs.points);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.moveTo(points[0][0], points[0][1]);

		for (let i = 1; i < points.length; i++) {
			scope.context.lineTo(points[i][0], points[i][1]);
		}

		scope.context.stroke();
	}

	drawPolygon(element, scope) {
		const attrs = getAttrs(element, ["points"]);
		const points = parseSvgPoints(attrs.points);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.moveTo(points[0][0], points[0][1]);

		for (let i = 1; i < points.length; i++) {
			scope.context.lineTo(points[i][0], points[i][1]);
		}

		scope.context.closePath();
		strokeAndFill(attrs, scope);
	}

	drawCircle(element, scope) {
		const attrs = getAttrs(element, ["cx", "cy", "r"]);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.arc(attrs.cx, attrs.cy, attrs.r, 0, Math.PI * 2, true);
		scope.context.closePath();

		strokeAndFill(attrs, scope);
	}

	drawEllipse(element, scope) {
		const attrs = getAttrs(element, ["cx", "cy", "rx", "ry"]);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.ellipse(attrs.cx, attrs.cy, attrs.rx, attrs.ry, 0, 0, Math.PI * 2, true);
		scope.context.closePath();

		strokeAndFill(attrs, scope);
	}

	drawOval(cx, cy, rx, ry, scope) {
		scope.context.beginPath();
		scope.context.translate(cx - rx, cy - ry);
		//scope.context.scale(rx, ry);
		scope.context.arc(1, 1, 1, 0, 2 * Math.PI, false);
		scope.context.closePath();

		strokeAndFill(attrs, scope);
	}

	drawLine(element, scope) {
		const attrs = getAttrs(element, ["x1", "x2", "y1", "y2"]);
		setContext(scope.context, attrs);

		scope.context.beginPath();
		scope.context.moveTo(attrs.x1, attrs.y1);
		scope.context.lineTo(attrs.x2, attrs.y2);

		strokeAndFill(attrs, scope);
	}

	drawText(element, scope) {
		const attrs = getAttrs(element, ["x", "y", "text-anchor"]);
		const font = getFont(element);
		scope.context.font = font;

		const textContent = element.textContent;
		const width = scope.context.measureText(textContent).width;
		const transformedAttrs = normalizeTextCoordinates(attrs, width);

		scope.context.fillText(textContent, transformedAttrs.x, transformedAttrs.y);
		if (attrs.stroke) {
			context.strokeText(textContent, transformedAttrs.x, transformedAttrs.y);
		}
	}

	drawPath(element, scope) {
		const attrs = getAttrs(element, ["d"]);
		const instructionList =  this.instructionSimplifier.simplifyInstructions(this.svgPathParser.parsePath(attrs.d));
		this.canvasRenderer.drawInstructionList(instructionList, {
			stroke: attrs.stroke || "#000",
			strokeWidth: attrs.strokeWidth,
			fillColor: attrs.fill
		});
	}
}