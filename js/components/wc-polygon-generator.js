import { renderPolygon, renderLinePath } from "../lib/render-poly.js";
import { fireEvent } from "../lib/utilities.js";

customElements.define("wc-polygon-generator",
	class extends HTMLElement {
		constructor(){
			super();
			this.bind(this);
		}
		bind(element){
			element.attachEvents = element.attachEvents.bind(element);
			element.render = element.render.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
			element.generate = element.generate.bind(element);
			element.finish = element.finish.bind(element);
		}
		connectedCallback(){
			this.render();
			this.cacheDom();
			this.attachEvents();
			this.generate();
		}
		render(){
			this.attachShadow({ mode: "open" });
			this.shadowRoot.innerHTML = `
				<link rel="stylesheet" href="css/system.css">
				<style>
					:host { display: grid; grid-template-columns: [form] 50% [output] 50%; }
					fieldset { padding: 0px; margin-bottom: 0.5rem; }
					#form { grid-column: form; }
					#output { grid-column: output; border: 1px solid black; background-image: var(--checker); background-size:20px 20px;
	background-position: 0 0, 0 10px, 10px -10px, 10px 0px; }
					.button-container { display: flex; }
				</style>
				<div id="form">
					<fieldset>
						<label for="side-count">Sides:</label>
						<input id="side-count" type="phone" value="3" />
					</fieldset>
					<fieldset>
						<label for="radius">Radius:</label>
						<input id="radius" value="25" />
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
		cacheDom(){
			this.dom = {
				sideCount : this.shadowRoot.querySelector("#side-count"),
				radius : this.shadowRoot.querySelector("#radius"),
				rotation: this.shadowRoot.querySelector("#rotation"),
				stroke: this.shadowRoot.querySelector("#stroke"),
				strokeWidth: this.shadowRoot.querySelector("#stroke-width"),
				fill: this.shadowRoot.querySelector("#fill"),
				renderType: this.shadowRoot.querySelector("#render-type"),
				finish: this.shadowRoot.querySelector("#finish"),
				output: this.shadowRoot.querySelector("#output")
			};
		}
		attachEvents(){
			this.dom.sideCount.addEventListener("input", this.generate);
			this.dom.radius.addEventListener("input", this.generate);
			this.dom.rotation.addEventListener("input", this.generate);
			this.dom.stroke.addEventListener("input", this.generate);
			this.dom.strokeWidth.addEventListener("input", this.generate);
			this.dom.fill.addEventListener("input", this.generate);
			this.dom.renderType.addEventListener("change", this.generate);
			this.dom.finish.addEventListener("click", this.finish);
		}
		generate(){
			const sideCount = parseInt(this.dom.sideCount.value, 10);
			const anglePerSide = 2 * Math.PI / sideCount;
			const radius = parseFloat(this.dom.radius.value);
			const rotation = parseFloat(this.dom.rotation.value) * Math.PI/180;
			const stroke = this.dom.stroke.value;
			const strokeWidth = parseFloat(this.dom.strokeWidth.value);
			const fill = this.dom.fill.value;
			const renderType = this.dom.renderType.value;

			const polarPoints = [];
			let currentTheta = rotation;

			for(let i = 0; i < sideCount; i++){
				polarPoints.push([radius, currentTheta]);
				currentTheta += anglePerSide;
			}
			
			const normalizedPoints = polarPoints.map(([r,theta]) => [r * Math.cos(theta) + radius, r * Math.sin(theta) + radius]);

			const svg = renderType === "polygon"
				? renderPolygon(radius * 2, radius * 2, normalizedPoints, fill, stroke, strokeWidth)
				: renderLinePath(radius * 2, radius * 2, normalizedPoints, fill, stroke, strokeWidth);
			this.dom.output.innerHTML = "";
			this.dom.output.appendChild(svg);
		}
		finish(){
			const svg = this.dom.output.querySelector("svg");
			fireEvent(this, "polygon-generated", svg ? svg.innerHTML : null);
		}
	}
)
