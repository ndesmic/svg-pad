import { renderPath } from "../lib/render-poly.js";
import { fireEvent } from "../lib/utilities.js";

customElements.define("wc-gear-generator",
	class extends HTMLElement {
		constructor() {
			super();
			this.bind(this);
		}
		bind(element) {
			element.attachEvents = element.attachEvents.bind(element);
			element.render = element.render.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
			element.generate = element.generate.bind(element);
			element.finish = element.finish.bind(element);
		}
		connectedCallback() {
			this.render();
			this.cacheDom();
			this.attachEvents();
			this.generate();
		}
		render() {
			this.attachShadow({ mode: "open" });
			this.shadowRoot.innerHTML = `
				<link rel="stylesheet" href="../../css/system.css">
				<style>
					:host { display: grid; grid-template-columns: [form] 200px [output] auto; }
					fieldset { padding: 0px; margin-bottom: 0.5rem; }
					#form { grid-column: form; }
					#output { grid-column: output; border: 1px solid black; background-image: var(--checker); background-size:20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, 10px 0px; }
					#finish { display: var(--finish-display, block); }
					.button-container { display: flex; }
				</style>
				<div id="form">
					<fieldset>
						<label for="tooth-count">Teeth:</label>
						<input id="tooth-count" type="phone" value="7" />
					</fieldset>
					<fieldset>
						<label for="inner-radius">Inner Radius:</label>
						<input id="inner-radius" value="30" />
					</fieldset>
					<fieldset>
						<label for="outer-radius">Outer Radius:</label>
						<input id="outer-radius" value="60" />
					</fieldset>
					<fieldset>
						<label for="inner-tooth-arc">Inner Tooth Arc:</label>
						<input id="inner-tooth-arc" value="40" />
					</fieldset>
					<fieldset>
						<label for="outer-tooth-arc">Outer Tooth Arc:</label>
						<input id="outer-tooth-arc" value="10" />
					</fieldset>
					<fieldset>
						<label for="rotation">Rotation:</label>
						<input id="rotation" value="0" />
					</fieldset>
					<fieldset>
						<label for="stroke">Stroke:</label>
						<input id="stroke" value="black" />
					</fieldset>
					<fieldset>
						<label for="stroke-width">Stroke Width:</label>
						<input id="stroke-width" value="1" />
					</fieldset>
					<fieldset>
						<label for="fill">Fill:</label>
						<input id="fill" value="transparent" />
					</fieldset>
					<fieldset>
						<label for="inner-curve">Inner Circle Curve:</label>
						<input id="inner-curve" type="checkbox" checked>
						<label for="outer-curve">Outer Circle Curve:</label>
						<input id="outer-curve" type="checkbox" checked>
					</fieldset>
					<div class="button-container">
						<button id="finish">Finish</button>
					</div>
				</div>
				<div id="output"></div>
			`
		}
		cacheDom() {
			this.dom = {
				toothCount: this.shadowRoot.querySelector("#tooth-count"),
				innerRadius: this.shadowRoot.querySelector("#inner-radius"),
				outerRadius: this.shadowRoot.querySelector("#outer-radius"),
				innerToothArc: this.shadowRoot.querySelector("#inner-tooth-arc"),
				outerToothArc: this.shadowRoot.querySelector("#outer-tooth-arc"),
				outerCurve: this.shadowRoot.querySelector("#outer-curve"),
				innerCurve: this.shadowRoot.querySelector("#inner-curve"),
				rotation: this.shadowRoot.querySelector("#rotation"),
				stroke: this.shadowRoot.querySelector("#stroke"),
				strokeWidth: this.shadowRoot.querySelector("#stroke-width"),
				fill: this.shadowRoot.querySelector("#fill"),
				finish: this.shadowRoot.querySelector("#finish"),
				output: this.shadowRoot.querySelector("#output")
			};
		}
		attachEvents() {
			this.dom.toothCount.addEventListener("input", this.generate);
			this.dom.innerRadius.addEventListener("input", this.generate);
			this.dom.outerRadius.addEventListener("input", this.generate);
			this.dom.innerToothArc.addEventListener("input", this.generate);
			this.dom.outerToothArc.addEventListener("input", this.generate);
			this.dom.innerCurve.addEventListener("change", this.generate);
			this.dom.outerCurve.addEventListener("change", this.generate);
			this.dom.rotation.addEventListener("input", this.generate);
			this.dom.stroke.addEventListener("input", this.generate);
			this.dom.strokeWidth.addEventListener("input", this.generate);
			this.dom.fill.addEventListener("input", this.generate);
			this.dom.finish.addEventListener("click", this.finish);
		}
		generate() {
			const toothCount = parseInt(this.dom.toothCount.value, 10);
			const innerToothArc = parseFloat(this.dom.innerToothArc.value) * Math.PI / 180;
			const outerToothArc = parseFloat(this.dom.outerToothArc.value) * Math.PI / 180;
			const anglePerTooth = 2 * Math.PI / toothCount;
			const innerRadius = parseFloat(this.dom.innerRadius.value);
			const outerRadius = parseFloat(this.dom.outerRadius.value);
			const rotation = parseFloat(this.dom.rotation.value) * Math.PI / 180;
			const stroke = this.dom.stroke.value;
			const strokeWidth = parseFloat(this.dom.strokeWidth.value);
			const fill = this.dom.fill.value;
			const isInnerCurve = this.dom.innerCurve.checked;
			const isOuterCurve = this.dom.outerCurve.checked;

			const halfInnerToothArc = innerToothArc / 2;
			const halfOuterToothArc = outerToothArc / 2;

			const points = [];
			let currentTheta = rotation;

			for (let i = 0; i < toothCount; i++) {
				points.push(
					i === 0
						? ["M", ...polarToCartesian(innerRadius, currentTheta - halfInnerToothArc, outerRadius, outerRadius)]
						: isInnerCurve
							? ["A", innerRadius, innerRadius, 0, 0, 1, ...polarToCartesian(innerRadius, currentTheta - halfInnerToothArc, outerRadius, outerRadius)]
							: ["L", ...polarToCartesian(innerRadius, currentTheta - halfInnerToothArc, outerRadius, outerRadius)],
					["L", ...polarToCartesian(outerRadius, currentTheta - halfOuterToothArc, outerRadius, outerRadius)],
					isOuterCurve
						? ["A", outerRadius, outerRadius, 0, 0, 1, ...polarToCartesian(outerRadius, currentTheta + halfOuterToothArc, outerRadius, outerRadius)]
						: ["L", ...polarToCartesian(outerRadius, currentTheta + halfOuterToothArc, outerRadius, outerRadius)],
					["L", ...polarToCartesian(innerRadius, currentTheta + halfInnerToothArc, outerRadius, outerRadius)]
				);
				currentTheta += anglePerTooth;
			}
			if (isInnerCurve) {
				points.push(["A", innerRadius, innerRadius, 0, 0, 1, ...polarToCartesian(innerRadius, rotation - halfInnerToothArc, outerRadius, outerRadius)]);
			}
			points.push(["Z"]);

			//render needs arcing
			const svg = renderPath(outerRadius * 2, outerRadius * 2, points, fill, stroke, strokeWidth);

			this.dom.output.innerHTML = "";
			this.dom.output.appendChild(svg);
		}
		finish() {
			const svg = this.dom.output.querySelector("svg");
			fireEvent(this, "gear-generated", svg ? svg.innerHTML : null);
		}
	}
);

function polarToCartesian(r, theta, cx = 0, cy = 0) {
	return [r * Math.cos(theta) + cx, r * Math.sin(theta) + cy];
}
