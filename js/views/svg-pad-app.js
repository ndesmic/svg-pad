"use strict";

let SvgPad = (function(){

	let defaults = {
 		defaultSvg : PrettyPrint.prettyPrintXml('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" height="100" width="100">\n\r</svg>')
	};

	function create(options){
		var svgPad = {};
		svgPad.options = Object.assign({}, defaults, options);

		svgPad.currentSvgData;
		svgPad.currentCssData;
		svgPad.currentSvgUrl;
		svgPad.currentCssUrl;

		bind(svgPad);

		svgPad.inserts = {
			rectangle : insertSvgText.bind(svgPad, '<rect x="0" y="0" height="8" width="8" fill="blue" />'),
			ellipse : insertSvgText.bind(svgPad, '<ellipse cx="5" cy="5" rx="5" ry="2.5" fill="magenta" />'),
			circle : insertSvgText.bind(svgPad, '<circle cx="5" cy="5" r="5" fill="red" />'),
			triangle : insertSvgText.bind(svgPad, '<polygon points="0,10 5,0 10,10" fill="green" />'),
			line : insertSvgText.bind(svgPad, '<line x1="0" y1="10" x2="10" y2="0" stroke="black" stroke-width="2" />'),
			text : insertSvgText.bind(svgPad, '<text x="5" y="5">Lorem Ipsum</text>'),
			path : insertSvgText.bind(svgPad, '<path d="M0,5 C5,10 10,0 15,5" stroke="black" fill="none" stroke-width="1" />')
		};
		svgPad.set = {
			backgroundColor : set.backgroundColor.bind(svgPad)
		};

		svgPad.init();
	}

	function bind(svgPad){
		svgPad.cacheDom = cacheDom.bind(svgPad);
		svgPad.attachEvents = attachEvents.bind(svgPad);
		svgPad.attachSubviews = attachSubviews.bind(svgPad);

		svgPad.init = init.bind(svgPad);
		svgPad.initSettings = initSettings.bind(svgPad);
		svgPad.changeBackgroundColor = changeBackgroundColor.bind(svgPad);
		svgPad.update = update.bind(svgPad);
		svgPad.updateSettings = updateSettings.bind(svgPad);
		svgPad.exportPreview = exportPreview.bind(svgPad);
		svgPad.exportImageDownload = exportImageDownload.bind(svgPad);
		svgPad.exportImageWindow = exportImageWindow.bind(svgPad);
		svgPad.prettyPrintSvg = prettyPrintSvg.bind(svgPad);
		svgPad.cloudSaveFile = cloudSaveFile.bind(svgPad);
		svgPad.reset = reset.bind(svgPad);
		svgPad.fileDragOver = fileDragOver.bind(svgPad);
		svgPad.fileDragLeave = fileDragLeave.bind(svgPad);
		svgPad.fileDrop = fileDrop.bind(svgPad);
		svgPad.fileUnhighlight = fileUnhighlight.bind(svgPad);
		svgPad.openSettings = openSettings.bind(svgPad);
		svgPad.haltEvent = haltEvent.bind(svgPad);
	}

	function init(){
		this.cacheDom();
		this.attachSubviews();
		this.attachEvents()
		this.initSettings();
		this.update();
	}

	function cacheDom(){
		this.dom = {};
		this.dom.main = document.querySelector("#main");
		this.dom.preview = document.querySelector("#preview");

		this.dom.backgroundColorButton = document.querySelector("#btn-background-color");
		this.dom.saveButton = document.querySelector("#btn-save");
		this.dom.exportPreviewButton = document.querySelector("#btn-export-preview");
		this.dom.exportButton = document.querySelector("#btn-export");
		this.dom.dropboxButton = document.querySelector("#btn-dropbox");
		this.dom.resetButton = document.querySelector("#btn-reset");
		this.dom.prettyPrintButton = document.querySelector("#btn-pretty-print");
		this.dom.settingsButton = document.querySelector("#btn-settings");

		this.dom.lineButton = document.querySelector("#btn-line");
		this.dom.rectButton = document.querySelector("#btn-rect");
		this.dom.circleButton = document.querySelector("#btn-circle");
		this.dom.ellipseButton = document.querySelector("#btn-ellipse");
		this.dom.triangleButton = document.querySelector("#btn-triangle");
		this.dom.textButton = document.querySelector("#btn-text");
		this.dom.pathButton = document.querySelector("#btn-path");

		this.dom.export = document.querySelector("#export")
		this.dom.cssMode = document.querySelector("#mode-css");
		this.dom.workspaceTabs = document.querySelector(".mode.tab");
		this.dom.editor = document.querySelector("#editor");

		this.dom.svgTab = document.querySelector("#mode-svg");
		this.dom.cssTab = document.querySelector("#mode-css");
	}

	function attachSubviews(){
		this.subviews = {};
		//this.dom.cssWorkspace.value = storedOrDefault("lastCssSave");

		this.subviews.svgEditor = CodeMirror(this.dom.editor, {
			value : storedOrDefault("lastSvgSave", this.options.defaultSvg),
			lineNumbers : true,
			lineWrapping: true,
			indentWithTabs: true,

		});
	}

	function attachEvents(){
		//self.dom.workspace.addEventListener("dragover", self.fileDragOver);
		//self.dom.workspace.addEventListener("dragleave", self.fileDragLeave);
		//self.dom.workspace.addEventListener("drop", self.fileDrop);
		//self.dom.cssWorkspace.addEventListener("input", self.update);

		this.subviews.svgEditor.on("change", this.update);//this.update
		this.dom.dropboxButton.addEventListener("click", this.cloudSaveFile);
		this.dom.backgroundColorButton.addEventListener("click", this.changeBackgroundColor);
		this.dom.exportPreviewButton.addEventListener("click", this.exportPreview);
		this.dom.exportButton.addEventListener("click", this.exportImageDownload);
		this.dom.exportButton.addEventListener("contextmenu", this.exportImageWindow);
		this.dom.prettyPrintButton.addEventListener("click", this.prettyPrintSvg);
		this.dom.settingsButton.addEventListener("click", this.openSettings);
		//
		this.dom.lineButton.addEventListener("click", this.inserts.line);
		this.dom.rectButton.addEventListener("click", this.inserts.rectangle);
		this.dom.circleButton.addEventListener("click", this.inserts.circle);
		this.dom.ellipseButton.addEventListener("click", this.inserts.ellipse);
		this.dom.triangleButton.addEventListener("click", this.inserts.triangle);
		this.dom.pathButton.addEventListener("click", this.inserts.path);
		this.dom.textButton.addEventListener("click", this.inserts.text);

		Keyboard.register("ctrl+z", function(){ alert("ctrl-z") });
	}

	function storedOrDefault(key, defaultValue){
		defaultValue = defaultValue || "";
		var storedValue = localStorage.getItem(key);
		return storedValue ? storedValue.trim() : defaultValue;
	}

	function initSettings(){
		var self = this;

		self.settings = {};
		try{
			self.settings = JSON.parse(storedOrDefault("lastSettings"));
		}catch(e){
			console.log("Could not load previous settings");
		}

		if(self.settings.canvasColor){
			self.set.backgroundColor(self.settings.canvasColor);
		}
	}

	function update(){
		this.dom.export.style.display = "none";

		this.svgData = this.subviews.svgEditor.getValue();
		//self.cssData = self.dom.cssWorkspace.value;

		this.svgBlob = new Blob([this.svgData], { type : "image/svg+xml" });
		//this.cssBlob = new Blob([self.cssData], { type : "text/css" });

		window.URL.revokeObjectURL(this.svgUrl);
		//window.URL.revokeObjectURL(self.cssUrl);
		window.URL.revokeObjectURL(this.docUrl);

		this.svgUrl = window.URL.createObjectURL(this.svgBlob);
		//this.cssUrl = window.URL.createObjectURL(this.cssBlob);
		var doc = util.createDocument(this.cssUrl, this.svgData);
		var docBlob = new Blob([doc], { type : "text/html" });
		this.docUrl = window.URL.createObjectURL(docBlob);

		this.dom.preview.src = this.docUrl;
		this.dom.saveButton.href = this.svgUrl;
		localStorage.setItem("lastSvgSave", this.svgData);
		localStorage.setItem("lastCssSave", this.cssData);
	}

	function updateSettings(){
		var self = this;
		localStorage.setItem("lastSettings", JSON.stringify(self.settings));
	}

	function exportPreview(){
		var self = this;
		var canvas = svgToCanvas.svgToCanvas(self.dom.svgWorkspace.val(), self.dom.cssWorkspace.val());
		self.dom.export.html(canvas);
		self.dom.export.show();
	}

	function exportImageDownload(){
		var self = this;
		var canvas = svgToCanvas.svgToCanvas(self.dom.svgWorkspace.val(), self.dom.cssWorkspace.val());
		var exportUrl = canvas.toDataURL("image/png");
		util.download(exportUrl, "image.png");
	}

	function exportImageWindow(e){
		var self = this;
		var canvas = svgToCanvas.svgToCanvas(self.dom.svgWorkspace.val(), self.dom.cssWorkspace.val());
		var exportUrl = canvas.toDataURL("image/png");
		window.open(exportUrl, "Exported Image");
		e.preventDefault();
	}

	function prettyPrintSvg(){
		var self = this;
		var value = self.dom.svgWorkspace.val();
		self.dom.svgWorkspace.val(prettyPrint.prettyPrintXML(value));
	}

	function changeBackgroundColor(){
		var self = this;
		var color = prompt("Please choose a color");
		if(color){
			self.set.backgroundColor(color);
		}
	}

	function cloudSaveFile(){
		var self = this;
		var fileName = prompt("Please enter a name.");
		if(fileName){
			fileName = util.normalizeFileName(fileName);
			self.options.dbc.save(self.svgBlob, fileName, function(){
				alert("success!");
			});
		}
	}

	function reset(){
		var self = this;
		localStorage.setItem("lastSvgSave");
		localStorage.setItem("lastCssSave");
		localStorage.setItem("lastSettings");
	}

	function insertSvgText(text){
		this.subviews.svgEditor.replaceSelection(text, "end");
		this.update();
	}

	function fileDragOver(e){
		var self = this;
		e = e.originalEvent;
		var fileInfo = e.dataTransfer.items[0];

		if(fileInfo.type == "image/svg+xml"){
			self.dom.workspace.addClass("svg-over");
			self.dom.svgTab.addClass("svg-over");
		}else if(fileInfo.type == "text/css"){
			self.dom.workspace.addClass("css-over");
			self.dom.cssTab.addClass("css-over");
		}else{
			self.dom.workspace.addClass("file-error");
		}

		e.stopPropagation();
		e.preventDefault();
	}

	function fileDragLeave(e){
		var self = this;
		self.fileUnhighlight();
		e.stopPropagation();
		e.preventDefault();
	}

	function fileDrop(e){
		var self = this;
		e.preventDefault();
		e.stopPropagation();
		e = e.originalEvent;

		var files = e.dataTransfer.files;
		var file = files[0];

		if(file.type == "image/svg+xml"){
			var reader = new FileReader();
			reader.onload = function(e){
				var svgText = e.target.result;
				self.dom.svgWorkspace.val(svgText);
				self.update();
			};
			reader.onerror = function(e){ console.log(e);};
			reader.readAsText(file);
		}else if(file.type == "text/css"){
			var reader = new FileReader();
			reader.onload = function(e){
				var cssText = e.target.result;
				self.dom.cssWorkspace.val(cssText);
				self.update();
			};
			reader.onerror = function(e){ console.log(e);};
			reader.readAsText(file);
		}

		self.fileUnhighlight();
	}

	function fileUnhighlight(){
		var self = this;
		self.dom.workspace.removeClass("svg-over css-over file-error");
		self.dom.svgTab.removeClass("svg-over");
		self.dom.cssTab.removeClass("css-over");
	}

	function openSettings(){
		Lightbox.open("Some Text");
	}

	function haltEvent(e){
		e.preventDefault();
		e.stopPropagation();
	}

	//settings
	var set = {
		backgroundColor : function(color){
			var self = this;
			self.settings.canvasColor = color;
			if(color == "transparent" || color == ""){
				self.dom.preview.style.backgroundColor = "";
				self.dom.preview.style.backgroundImage = "";
			}else{
				self.dom.preview.style.backgroundColor = self.settings.canvasColor;
				self.dom.preview.style.backgroundImage = "none";
			}
			self.updateSettings();
		}
	}

	return {
		create : create
	};

})();
