customElements.define("wc-svg-canvas",
	class svgcanvas extends HTMLElement {
		static get observedAttributes(){
			return [];
		}
		constructor(){
			super();
			this.bind(this);
		}
		bind(element){
			element.render = element.render.bind(element);
			element.cacheDom = element.cacheDom.bind(element);
		}
		connectedCallback(){
			this.render();
			this.cacheDom();
		}
		render(){
			this.attachShadow({ mode: "open" });
		}
		update(svg, css){
			const styleSheet = new CSSStyleSheet();
			styleSheet.replaceSync(css);
			this.shadowRoot.adoptedStyleSheets = [styleSheet];
			this.shadowRoot.innerHTML = svg;
		}
		cacheDom(){
			this.dom = {};
		}
	}
)
