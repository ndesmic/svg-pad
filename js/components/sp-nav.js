class SpNav extends HTMLElement {
	constructor() {
		super();
	}
	connectedCallback() {
		const details = Array.from(this.querySelectorAll("details"));
		details.forEach(d =>{
			d.addEventListener("click", e => {
				details.filter(d => d !== e.target).forEach(d => d.removeAttribute("open"));
			});
		});
	}
}

customElements.define("sp-nav", SpNav);
