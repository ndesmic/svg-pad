import { SvgPathParser } from "../../js/lib/svg-path/svg-path-parser.js";
import { InstructionSimplifier } from "../../js/lib/svg-path/instruction-simplifier.js";
import { flipAcrossX } from "../../js/lib/svg-path/path-transformer.js";
import { CanvasRenderer } from "../../js/lib/svg-path/canvas-renderer.js";

const pathParser = new SvgPathParser();
const instructionSimplifier = new InstructionSimplifier();

Array.from(document.querySelectorAll("section"))
	.forEach(section => {
		const path = section.querySelector("svg path");
		const data = path.getAttribute("d");
		const instructions = pathParser.parsePath(data);
		const simplifiedInstructions = instructionSimplifier.simplifyInstructions(instructions);
		const invertedInstructions = simplifiedInstructions.map(i => flipAcrossX(i, 10));
		const canvasRenderer = new CanvasRenderer();
		canvasRenderer.canvas.width = 20;
		canvasRenderer.canvas.height = 20;
		canvasRenderer.drawInstructionList(invertedInstructions, { fillColor: "#000", strokeWidth: 0 });
		section.appendChild(canvasRenderer.canvas);
	});