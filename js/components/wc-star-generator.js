import { renderPolygon, renderLinePath } from "../lib/render-poly.js";
import { fireEvent } from "../lib/utilities.js";

customElements.define("wc-star-generator",
	class extends HTMLElement {
		constructor() {
			super();
			this.bind(this);
		}
		bind(element) {
			element.attachEvents = element.attachEvents.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
			element.render = element.render.bind(element);
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
						<label for="spike-count">Spikes:</label>
						<input id="spike-count" type="phone" value="5" />
					</fieldset>
					<fieldset>
						<label for="inner-radius">Inner Radius:</label>
						<input id="inner-radius" value="10" />
					</fieldset>
					<fieldset>
						<label for="outer-radius">Outer Radius:</label>
						<input id="outer-radius" value="25" />
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
						<label for="render-type">Render Type:</label>
						<select id="render-type">
							<option value="polygon">Polygon</option>
							<option value="path">Path</option>
						</select>
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
				spikeCount: this.shadowRoot.querySelector("#spike-count"),
				innerRadius: this.shadowRoot.querySelector("#inner-radius"),
				outerRadius: this.shadowRoot.querySelector("#outer-radius"),
				rotation: this.shadowRoot.querySelector("#rotation"),
				stroke: this.shadowRoot.querySelector("#stroke"),
				strokeWidth: this.shadowRoot.querySelector("#stroke-width"),
				fill: this.shadowRoot.querySelector("#fill"),
				renderType: this.shadowRoot.querySelector("#render-type"),
				finish: this.shadowRoot.querySelector("#finish"),
				output: this.shadowRoot.querySelector("#output")
			};
		}
		attachEvents() {
			this.dom.spikeCount.addEventListener("input", this.generate);
			this.dom.innerRadius.addEventListener("input", this.generate);
			this.dom.outerRadius.addEventListener("input", this.generate);
			this.dom.rotation.addEventListener("input", this.generate);
			this.dom.stroke.addEventListener("input", this.generate);
			this.dom.strokeWidth.addEventListener("input", this.generate);
			this.dom.fill.addEventListener("input", this.generate);
			this.dom.renderType.addEventListener("change", this.generate);

			this.dom.finish.addEventListener("click", this.finish);
		}
		generate() {
			const spikeCount = parseInt(this.dom.spikeCount.value, 10);
			const anglePerSpike = 2 * Math.PI / spikeCount;
			const anglePerHalfSpike = anglePerSpike / 2;
			const innerRadius = parseFloat(this.dom.innerRadius.value);
			const outerRadius = parseFloat(this.dom.outerRadius.value);
			const rotation = parseFloat(this.dom.rotation.value) * Math.PI / 180;
			const stroke = this.dom.stroke.value;
			const strokeWidth = parseFloat(this.dom.strokeWidth.value);
			const fill = this.dom.fill.value;
			const renderType = this.dom.renderType.value;

			const polarPoints = []
			let currentTheta = rotation;

			for (let i = 0; i < spikeCount; i++) {
				polarPoints.push([innerRadius, currentTheta]);
				currentTheta += anglePerHalfSpike;
				polarPoints.push([outerRadius, currentTheta]);
				currentTheta += anglePerHalfSpike;
			}

			const normalizedPoints = polarPoints.map(([r, theta]) => [r * Math.cos(theta) + outerRadius, r * Math.sin(theta) + outerRadius]);

			const svg = renderType === "polygon"
				? renderPolygon(outerRadius * 2, outerRadius * 2, normalizedPoints, fill, stroke, strokeWidth)
				: renderLinePath(outerRadius * 2, outerRadius * 2, normalizedPoints, fill, stroke, strokeWidth);
			this.dom.output.innerHTML = "";
			this.dom.output.appendChild(svg);
		}
		finish() {
			const svg = this.dom.output.querySelector("svg");
			fireEvent(this, "star-generated", svg ? svg.innerHTML : null);
		}
	}
)
