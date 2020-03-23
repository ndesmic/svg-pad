import { SvgPathParser } from "../../js/lib/svg-path/svg-path-parser.js";
import { makeAbsolute } from "../../js/lib/svg-path/make-absolute.js";
import { SvgRenderer } from "../../js/lib/svg-path/svg-renderer.js";

const pathParser = new SvgPathParser();

Array.from(document.querySelectorAll("section"))
	.forEach(section => {
		const path = section.querySelector("svg path");
		const data = path.getAttribute("d");
		const instructions = pathParser.parsePath(data);
		const absoluteInstructions = makeAbsolute(instructions);
		const svgRenderer = new SvgRenderer();
		svgRenderer.svg.setAttribute("width", 50);
		svgRenderer.svg.setAttribute("height", 50);
		svgRenderer.svg.setAttribute("stroke", "#000");
		svgRenderer.drawInstructionList(absoluteInstructions);
		section.appendChild(svgRenderer.svg);
	});