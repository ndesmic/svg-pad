"use strict";

var Keyboard = (function(){
	
	var keyMapper = { //unfinished
		13 : "enter",
		16 : "shift",
		17 : "ctrl",
		18 : "alt",
		27 : "esc",
		32 : "space",
		37 : "left",
		38 : "up",
		39 : "right",
		40 : "down",
		49 : "one",
		50 : "two",
		51 : "three",
		52 : "four",
		53 : "five",
		65 : "six",
		67 : "seven",
		68 : "eight",
		69 : "nine",
		192 : "tilde"
	};
	
	var keyName = {
		"enter" : 13,
		"shift" : 16,
		"ctrl" : 17,
		"alt" : 18,
		"esc" : 27,
		"space" : 32,
		"left" : 37,
		"up" : 38,
		"right" : 39,
		"down" : 40,
		"one" : 49,
		"two" : 50,
		"three" : 51,
		"four" : 52,
		"five" : 53,
		"six" : 54,
		"seven" : 55,
		"eight" : 56,
		"nine" : 57,
		"tilde" : 192
	}
	
	var pressedKeys = {};
	var unhandledKeys = {};
	var handlers = {};
	
	document.addEventListener("keydown", function(e){
		var key = keyMapper[e.which];
		var stroke = mapStroke(e);
		pressedKeys[key] = true;
		if(handlers[stroke]){
			handlers[stroke]();
		}else{
			unhandledKeys[key] = true;
		}
	}, true);
	
	document.addEventListener("keyup", function(e){
		var key = keyMapper[e.which];
		pressedKeys[key] = false;
		unhandledKeys[key] = false;
	}, true);
	
	function mapStroke(e){
		var key = keyMapper[e.which];
		var stroke = key;
		if(e.shiftKey && key != "shift"){
			stroke = "shift+" + stroke;
		}
		if(e.altKey && key != "alt"){
			stroke = "alt+" + stroke;
		}
		if(e.ctrlKey && key != "ctrl"){
			stroke = "ctrl+" + stroke;
		}
		return stroke;
	}
	
	function isAnyPressed(){
		for(var key in pressedKeys){
			if(pressedKeys[key]){
				return true;
			}
		}
		return false;
	}
	
	function register(key, handler){
		handlers[key] = handler;
	}
	
	return {
		pressedKeys: pressedKeys,
		unhandledKeys : unhandledKeys,
		isAnyKeyPressed: isAnyPressed,
		register : register
	};
})();