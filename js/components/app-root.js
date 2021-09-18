import { download } from "../lib/utilities.js";
import { SvgToCanvas } from "../lib/svg-to-canvas.js";
import { prettyPrintXml } from "../lib/pretty-print.js";
import { empty } from "../lib/dom-tools.js";
import "./wc-svg-canvas.js"; //slows load until this component is ready

function storedOrDefault(key, defaultValue = "") {
	const storedValue = localStorage.getItem(key);
	return storedValue ? storedValue.trim() : defaultValue;
}

customElements.define("app-root",
	class AppRoot extends HTMLElement {
		currentSvgData;
		currentCssData;
		currentSvgUrl;
		currentCssUrl;

		constructor() {
			super();
			this.svgToCanvas = new SvgToCanvas();
			this.bind(this);
		}

		bind(appRoot){
			this.insertSvgText = this.insertSvgText.bind(appRoot);

			this.inserts = {
				rectangle: () => this.insertSvgText('<rect x="10" y="10" height="50" width="75" fill="blue" />'),
				ellipse: () => this.insertSvgText('<ellipse cx="75" cy="50" rx="50" ry="30" fill="magenta" />'),
				circle: () => this.insertSvgText('<circle cx="50" cy="50" r="40" fill="red" />'),
				line: () => this.insertSvgText('<line x1="10" y1="10" x2="60" y2="70" stroke="black" stroke-width="2" />'),
				text: () => this.insertSvgText('<text x="40" y="50">Lorem Ipsum</text>'),
				path: () => this.insertSvgText('<path d="M10,50 C50,100 100,0 150,50" stroke="black" fill="none" stroke-width="3" />')
			};
			
			this.set = {
				backgroundColor: this.set.backgroundColor.bind(appRoot)
			};

			this.cacheDom = this.cacheDom.bind(appRoot);
			this.attachEvents = this.attachEvents.bind(appRoot);
			this.attachSubviews = this.attachSubviews.bind(appRoot);
			this.setLaunchQueue = this.setLaunchQueue.bind(appRoot);

			this.connectedCallback = this.connectedCallback.bind(appRoot);
			this.initSettings = this.initSettings.bind(appRoot);
			this.changeBackgroundColor = this.changeBackgroundColor.bind(appRoot);
			this.update = this.update.bind(appRoot);
			this.updateSettings = this.updateSettings.bind(appRoot);
			this.exportPreview = this.exportPreview.bind(appRoot);
			this.exportImageDownload = this.exportImageDownload.bind(appRoot);
			this.exportImageWindow = this.exportImageWindow.bind(appRoot);
			this.prettyPrintSvg = this.prettyPrintSvg.bind(appRoot);
			this.load = this.load.bind(appRoot);
			this.save = this.save.bind(appRoot);
			this.reset = this.reset.bind(appRoot);
			this.fileDragOver = this.fileDragOver.bind(appRoot);
			this.fileDragLeave = this.fileDragLeave.bind(appRoot);
			this.fileDrop = this.fileDrop.bind(appRoot);
			this.fileUnhighlight = this.fileUnhighlight.bind(appRoot);
			this.openSettings = this.openSettings.bind(appRoot);
			this.openStarTool = this.openStarTool.bind(appRoot);
			this.openPolygonTool = this.openPolygonTool.bind(appRoot);
			this.openGearTool = this.openGearTool.bind(appRoot);
			this.haltEvent = this.haltEvent.bind(appRoot);
		}

		connectedCallback() {
			this.options = {
				defaultSvg: prettyPrintXml(this.getAttribute("default-svg"))
			}

			this.cacheDom();
			this.setLaunchQueue();
			this.attachSubviews();
			this.attachEvents();
			this.initSettings();
			this.update();
		}

		cacheDom() {
			this.dom = {
				main: document.querySelector("main"),
				preview: document.querySelector("#preview"),
				backgroundColorButton: document.querySelector("#btn-background-color"),
				loadButton: document.querySelector("#btn-load"),
				saveButton: document.querySelector("#btn-save"),
				downloadButton: document.querySelector("#btn-download"),
				exportPreviewButton: document.querySelector("#btn-export-preview"),
				exportButton: document.querySelector("#btn-export"),
				resetButton: document.querySelector("#btn-reset"),
				prettyPrintButton: document.querySelector("#btn-pretty-print"),
				settingsButton: document.querySelector("#btn-settings"),
				lineButton: document.querySelector("#btn-line"),
				rectButton: document.querySelector("#btn-rect"),
				circleButton: document.querySelector("#btn-circle"),
				ellipseButton: document.querySelector("#btn-ellipse"),
				polygonButton: document.querySelector("#btn-polygon"),
				starButton: document.querySelector("#btn-star"),
				gearButton: document.querySelector("#btn-gear"),
				textButton: document.querySelector("#btn-text"),
				pathButton: document.querySelector("#btn-path"),
				export: document.querySelector("#export"),
				cssMode: document.querySelector("#mode-css"),
				workspaceTabs: document.querySelector(".mode.tab"),
				editPanel: document.querySelector("#edit-panel"),
				svgEditor: document.querySelector("#svg-editor"),
				cssEditor: document.querySelector("#css-editor"),
				svgTab: document.querySelector("#mode-svg"),
				cssTab: document.querySelector("#mode-css"),

				starModal: document.querySelector("#mod-star"),
				starTool: document.querySelector("wc-star-generator"),
				polyModal: document.querySelector("#mod-polygon"),
				polygonTool: document.querySelector("wc-polygon-generator"),
				gearModal: document.querySelector("#mod-gear"),
				gearTool: document.querySelector("wc-gear-generator")
			};
		}

		setLaunchQueue(){
			if ("launchQueue" in window) {
				launchQueue.setConsumer(async launchParams => {
					if (launchParams.files.length) {
						const svgs = launchParams.files.filter(f => /\.svg$/.test(f.name));
						const csss = launchParams.files.filter(f => /\.css$/.test(f.name));
						if(svgs.length > 0){
							const file = await svgs[0].getFile();
							this.subviews.svgEditor.setValue(await file.text());
						}
						if (csss.length > 0) {
							const file = await csss[0].getFile()
							this.subviews.cssEditor.setValue(await file.text());
						}
					}
				});
			}
		}

		attachSubviews() {
			this.subviews = {};

			this.subviews.svgEditor = CodeMirror(this.dom.svgEditor, {
				value: storedOrDefault("lastSvgSave", this.options.defaultSvg),
				lineNumbers: true,
				lineWrapping: true,
				indentWithTabs: true
			});
			this.subviews.cssEditor = CodeMirror(this.dom.cssEditor, {
				value: storedOrDefault("lastCssSave", ""),
				lineNumbers: true,
				lineWrapping: true,
				indentWithTabs: true
			});

			this.subviews.editTabs = Tabs.create({
				root: this.dom.editPanel
			});
		}

		attachEvents() {
			this.subviews.svgEditor.on("change", this.update);
			this.subviews.cssEditor.on("change", this.update);
			this.dom.backgroundColorButton.addEventListener("click", this.changeBackgroundColor);
			this.dom.exportPreviewButton.addEventListener("click", this.exportPreview);
			this.dom.exportButton.addEventListener("click", this.exportImageDownload);
			this.dom.exportButton.addEventListener("contextmenu", this.exportImageWindow);
			this.dom.prettyPrintButton.addEventListener("click", this.prettyPrintSvg);
			this.dom.settingsButton.addEventListener("click", this.openSettings);
			this.dom.loadButton.addEventListener("click", this.load);
			this.dom.saveButton.addEventListener("click", this.save);
			this.dom.starButton.addEventListener("click", this.openStarTool);
			this.dom.polygonButton.addEventListener("click", this.openPolygonTool);
			this.dom.gearButton.addEventListener("click", this.openGearTool);
			//SVG buttons
			this.dom.lineButton.addEventListener("click", this.inserts.line);
			this.dom.rectButton.addEventListener("click", this.inserts.rectangle);
			this.dom.circleButton.addEventListener("click", this.inserts.circle);
			this.dom.ellipseButton.addEventListener("click", this.inserts.ellipse);
			this.dom.pathButton.addEventListener("click", this.inserts.path);
			this.dom.textButton.addEventListener("click", this.inserts.text);
			//modal tools
			this.dom.starTool.addEventListener("star-generated", e => {
				this.insertSvgText(e.detail);
				this.dom.starModal.close();
			});
			this.dom.polygonTool.addEventListener("polygon-generated", e => {
				this.insertSvgText(e.detail);
				this.dom.polyModal.close();
			});
			this.dom.gearTool.addEventListener("gear-generated", e => {
				this.insertSvgText(e.detail);
				this.dom.gearModal.close();
			});
			this.dom.main.addEventListener("click", () => document.querySelectorAll("details").forEach(d => d.removeAttribute("open")));
		}

		initSettings() {
			this.settings = {};
			try {
				this.settings = JSON.parse(storedOrDefault("lastSettings"));
			} catch (e) {
				console.error("Could not load previous settings");
			}

			if (this.settings.canvasColor) {
				this.set.backgroundColor(this.settings.canvasColor);
			}
		}

		update() {
			this.dom.export.style.display = "none";

			const svgData = this.subviews.svgEditor.getValue();
			const cssData = this.subviews.cssEditor.getValue();

			this.dom.preview.update(svgData, cssData);
			this.dom.downloadButton.href = `data:image/svg+xml;utf8,${encodeURIComponent(svgData)}`;

			localStorage.setItem("lastSvgSave", svgData);
			localStorage.setItem("lastCssSave", cssData);
		}

		updateSettings() {
			localStorage.setItem("lastSettings", JSON.stringify(this.settings));
		}

		exportPreview() {
			const canvas = this.svgToCanvas.render(this.subviews.svgEditor.getValue());
			empty(this.dom.export);
			this.dom.export.appendChild(canvas);
			this.dom.export.style.display = "block";
		}

		exportImageDownload() {
			const canvas = this.svgToCanvas.render(this.subviews.svgEditor.getValue());
			const exportUrl = canvas.toDataURL("image/png");
			download(exportUrl, "image.png");
		}

		exportImageWindow(e) {
			const canvas = this.svgToCanvas.render(this.subviews.svgEditor.getValue());
			const exportUrl = canvas.toDataURL("image/png");
			window.open(exportUrl, "Exported Image");
			e.preventDefault();
		}

		prettyPrintSvg() {
			const value = this.subviews.svgEditor.getValue();
			this.subviews.svgEditor.setValue(prettyPrintXml(value));
		}

		changeBackgroundColor() {
			const color = prompt("Please choose a color");
			if (color) {
				this.set.backgroundColor(color);
			}
		}

		reset() {
			localStorage.setItem("lastSvgSave");
			localStorage.setItem("lastCssSave");
			localStorage.setItem("lastSettings");
		}

		insertSvgText(text) {
			this.subviews.svgEditor.replaceSelection(text, "end");
			this.update();
		}

		fileDragOver(e) {
			const fileInfo = e.dataTransfer.items[0];

			if (fileInfo.type == "image/svg+xml") {
				this.dom.workspace.addClass("svg-over");
				this.dom.svgTab.addClass("svg-over");
			} else if (fileInfo.type == "text/css") {
				this.dom.workspace.addClass("css-over");
				this.dom.cssTab.addClass("css-over");
			} else {
				this.dom.workspace.addClass("file-error");
			}

			e.stopPropagation();
			e.preventDefault();
		}

		fileDragLeave(e) {
			this.fileUnhighlight();
			e.stopPropagation();
			e.preventDefault();
		}

		fileDrop(e) {
			e.preventDefault();
			e.stopPropagation();

			const files = e.dataTransfer.files;
			const file = files[0];

			if (file.type == "image/svg+xml") {
				const reader = new FileReader();
				reader.onload = e => {
					const svgText = e.target.result;
					this.subviews.svgEditor.setValue(svgText);
					this.update();
				};
				reader.onerror = e => console.error(e);
				reader.readAsText(file);
			} else if (file.type == "text/css") {
				const reader = new FileReader();
				reader.onload = e => {
					const cssText = e.target.result;
					this.subviews.cssEditor.setValue(cssText);
					this.update();
				};
				reader.onerror = e => console.error(e);
				reader.readAsText(file);
			}

			this.fileUnhighlight();
		}
		async load() {
			if (!window.showOpenFilePicker) {
				alert("File System not supported by this browser");
			}
			const [handle] = await window.showOpenFilePicker({
				types: [
					{
						description: 'SVG file',
						accept: {
							'image/svg+xml' : [".svg"]
						}
					}
				]
			});
			this.handle = handle;
			const file = await this.handle.getFile();
			this.subviews.svgEditor.setValue(await file.text());
		}

		async save() {
			if (!window.showSaveFilePicker) {
				alert("File System not supported by this browser");
			}
			if (!this.handle) {
				this.handle = await window.showSaveFilePicker({
					types: [
						{
							description: 'SVG file',
							accept: {
								'image/svg+xml': [".svg"]
							}
						}
					]
				});
			}
			const writable = await this.handle.createWritable();
			await writable.write(this.subviews.svgEditor.getValue());
			await writable.close();
			alert("Save Successful!");
		}

		fileUnhighlight() {
			this.dom.workspace.removeClass("svg-over css-over file-error");
			this.dom.svgTab.removeClass("svg-over");
			this.dom.cssTab.removeClass("css-over");
		}

		openModal(id){
			const modal = document.querySelector(id);
			modal.show();
			document.querySelectorAll("details").forEach(d => d.removeAttribute("open"));
			document.querySelector(`${id} .close`).addEventListener("click", () => modal.close(), { once: true });
		}

		openSettings() {
			this.openModal("#mod-settings");
		}

		openPolygonTool() {
			this.openModal("#mod-polygon");
		}

		openStarTool() {
			this.openModal("#mod-star");
		}

		openGearTool() {
			this.openModal("#mod-gear");
		}

		haltEvent(e) {
			e.preventDefault();
			e.stopPropagation();
		}

		//settings
		set = {
			backgroundColor: function (color) {
				this.settings.canvasColor = color;
				if (color == "transparent" || color == "") {
					this.dom.preview.style.backgroundColor = "";
					this.dom.preview.style.backgroundImage = "";
				} else {
					this.dom.preview.style.backgroundColor = this.settings.canvasColor;
					this.dom.preview.style.backgroundImage = "none";
				}
				this.updateSettings();
			}
		}
	}
);
