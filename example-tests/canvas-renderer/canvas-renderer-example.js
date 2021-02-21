import { SvgToCanvas } from "../../js/lib/svg-to-canvas.js";

Array.from(document.querySelectorAll("section"))
	.forEach(section => {
		section.querySelectorAll("tbody tr").forEach(tr => {
			const svg = tr.querySelector("td:nth-child(2) svg");
			const svgToCanvas = new SvgToCanvas();
			const svgText = svg.outerHTML;
			svgToCanvas.render(svgText);
			tr.querySelector("td:nth-child(3)").appendChild(svgToCanvas.canvas);
		});
	});