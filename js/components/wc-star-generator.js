import { renderPolygon, renderPath } from "../lib/render-poly.js";

customElements.define("wc-star-generator",
	class extends HTMLElement {
		constructor(){
			super();
			this.bind(this);
		}
		bind(element){
			element.attachEvents = element.attachEvents.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
			element.render = element.render.bind(element);
			element.generate = element.generate.bind(element);
		}
		connectedCallback(){
			this.render();
			this.cacheDom();
			this.attachEvents();
		}
		render(){
			this.attachShadow({ mode: "open" });
			this.shadowRoot.innerHTML = `
				<link rel="stylesheet" href="../../css/index.css">
				<style>
					:host { display: grid; grid-template-columns: [form] 50% [output] 50%; padding: 0.5rem; }
					#form { grid-column: form; }
					#output { grid-column: output; }
				</style>
				<div id="form">
					<label for="spike-count">Spikes:</label>
					<input id="spike-count" type="phone" value="5" />
					<label for="inner-radius">Inner Radius:</label>
					<input id="inner-radius" value="10" />
					<label for="outer-radius">Outer Radius:</label>
					<input id="outer-radius" value="25" />
					<label for="rotation">Rotation:</label>
					<input id="rotation" value="0" />
					<label for="stroke">Stroke:</label>
					<input id="stroke" value="black" />
					<label for="stroke-width">Stroke Width:</label>
					<input id="stroke-width" value="1" />
					<label for="fill">Fill:</label>
					<input id="fill" value="transparent" />
					<label for="render-type">Render Type:</label>
					<select id="render-type">
						<option value="polygon">Polygon</option>
						<option value="path">Path</option>
					</select>
					<button id="generate">Generate</button>
				</div>
				<div id="output"></div>
			`
		}
		cacheDom(){
			this.dom = {
				spikeCount : this.shadowRoot.querySelector("#spike-count"),
				innerRadius : this.shadowRoot.querySelector("#inner-radius"),
				outerRadius : this.shadowRoot.querySelector("#outer-radius"),
				rotation: this.shadowRoot.querySelector("#rotation"),
				stroke: this.shadowRoot.querySelector("#stroke"),
				strokeWidth: this.shadowRoot.querySelector("#stroke-width"),
				fill: this.shadowRoot.querySelector("#fill"),
				renderType: this.shadowRoot.querySelector("#render-type"),
				generate: this.shadowRoot.querySelector("#generate"),
				output: this.shadowRoot.querySelector("#output")
			};
		}
		attachEvents(){
			this.dom.generate.addEventListener("click", this.generate);
		}
		generate(){
			const spikeCount = parseInt(this.dom.spikeCount.value, 10);
			const anglePerSpike = 2 * Math.PI / spikeCount;
			const anglePerHalfSpike = anglePerSpike / 2;
			const innerRadius = parseFloat(this.dom.innerRadius.value);
			const outerRadius = parseFloat(this.dom.outerRadius.value);
			const rotation = parseFloat(this.dom.rotation.value) * Math.PI/180;
			const stroke = this.dom.stroke.value;
			const strokeWidth = parseFloat(this.dom.strokeWidth.value);
			const fill = this.dom.fill.value;
			const renderType = this.dom.renderType.value;

			const polarPoints = []
			let currentTheta = rotation;
			
			for(let i = 0; i < spikeCount; i++){
				polarPoints.push([innerRadius, currentTheta]);
				currentTheta += anglePerHalfSpike;
				polarPoints.push([outerRadius, currentTheta]);
				currentTheta += anglePerHalfSpike;
			}
			
			const normalizedPoints = polarPoints.map(([r,theta]) => [r * Math.cos(theta) + outerRadius, r * Math.sin(theta) + outerRadius]);

			const svg = renderType === "polygon"
				? renderPolygon(outerRadius * 2, outerRadius * 2, normalizedPoints, fill, stroke, strokeWidth)
				: renderPath(outerRadius * 2, outerRadius * 2, normalizedPoints, fill, stroke, strokeWidth);
			this.dom.output.innerHTML = "";
			this.dom.output.appendChild(svg);
		}
	}
)
