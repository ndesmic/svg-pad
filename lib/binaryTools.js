var bt = (function(){

	function arrayBufferToHex(arrayBuffer, options){
		var dataView = new DataView(arrayBuffer);
		options = options || {};
		var from = options.from || 0;
		var to = options.to || dataView.byteLength; //not inclusive
		var splitLength = options.splitLength || 0;
		
		if(to && options.length){
			to = from + options.length;
		}
		
		var hex = "";
		
		for(var i = from; i < to; i++){
			var newHex = dataView.getUint8(i).toString(16);
			hex += pad(newHex, 2);
			if(splitLength && ((i + 1) % splitLength) == 0 && i != dataView.byteLength - 1){
				hex += ", "
			}
		}
		
		return hex;
	}
	
	function arrayBufferToBinary(arrayBuffer, splitLength){
		var dataView = new DataView(arrayBuffer);
		var bin = "";
		
		for(var i = 0; i < dataView.byteLength; i++){
			var newBin = dataView.getUint8(i).toString(2);
			bin += pad(newBin, 8) + " ";
			if(splitLength && ((i + 1) % splitLength) == 0 && i != dataView.byteLength - 1){
				bin += ", "
			}
		}
		
		return bin.trim();
	}
	
	
	function arrayBufferToString(arrayBuffer, start, length){
		start = start || 0;
		length = length || arrayBuffer.byteLength;
		var dataView = new DataView(arrayBuffer, start, length);
		var newString = ""
		for(var i = 0; i < dataView.byteLength; i++){
			newString += String.fromCharCode(dataView.getUint8(start + i));
		}
		return newString;
	}
	
	function pad(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	
	function byteArrayToArrayBuffer(array){
		var arrayBuffer = new ArrayBuffer(array.length);
		var uInt8Array = new Uint8Array(arrayBuffer);
		
		for(var i = 0; i < array.length; i++){
			uInt8Array[i] = array[i];
		}
		
		return arrayBuffer;
	}
	
	function dataURItoBlob(dataURI) {
		var uriSplit = dataURI.split(',');
		var byteString = atob(uriSplit[1]);
		var mimeString = uriSplit[0].split(':')[1].split(';')[0];
		var arrayBuffer = new ArrayBuffer(byteString.length);
		var uInt8Array = new Uint8Array(arrayBuffer);
		
		for (var i = 0; i < byteString.length; i++) {
			uInt8Array[i] = byteString.charCodeAt(i);
		}
		
		var blob = new Blob([uInt8Array], { "type" : mimeString });
		return blob;
	}
	
	function dataURItoArrayBuffer(dataURI) {
		var uriSplit = dataURI.split(',');
		var byteString = atob(uriSplit[1]);
		var mimeString = uriSplit[0].split(':')[1].split(';')[0];
		var arrayBuffer = new ArrayBuffer(byteString.length);
		var uInt8Array = new Uint8Array(arrayBuffer);
		
		for (var i = 0; i < byteString.length; i++) {
			uInt8Array[i] = byteString.charCodeAt(i);
		}
		
		return arrayBuffer;
	}
	
	function dataURItoUint8Array(dataURI) {
		var arrayBuffer = dataURItoArrayBuffer(dataURI);
		return new Uint8Array(arrayBuffer);
	}

	function dataViewToByteArray(dataView, start, length){
		start = start || 0;
		length = length || dataView.byteLength - start;
		var array = [];

		for(var i = start; i < start + length; i++){
			array.push(dataView.getUint8(i))
		}

		return array;
	}

	function dataViewToString(dataView, start, length){
		start = start || 0;
		length = length || dataView.byteLength - start;
		var newString = "";

		for(var i = start; i < start + length; i++){
			newString += String.fromCharCode(dataView.getUint8(i));
		}

		return newString;
	}
	
	function stringToArrayBuffer(string){
		var arrayBuffer = new ArrayBuffer(string.length);
		var uInt8Array = new Uint8Array(arrayBuffer);
		
		for (var i = 0; i < string.length; i++) {
			uInt8Array[i] = string.charCodeAt(i);
		}
		
		return arrayBuffer;
	}

	function stringToByteArray(string){
		var array = [];
		for(var i = 0; i < string.length; i++){
			array.push(string.charCodeAt(i));
		}
		return array;
	}

	function stringToDataUri(newString, options){
		var mimeType = options.mimeType || "text/plain";
		var base64 = options.base64 || false;
		var charEncoding = options.charEncoding || "utf8";
		var uri = "data:" + mimeType + ";utf8,";
		if(base64){
			newString = atob(newString);
		}

		return uri;
	}

	return {
		arrayBufferToHex : arrayBufferToHex,
		arrayBufferToBinary : arrayBufferToBinary,
		arrayBufferToString : arrayBufferToString,
		byteArrayToArrayBuffer : byteArrayToArrayBuffer,
		dataURItoBlob : dataURItoBlob,
		dataURItoArrayBuffer : dataURItoArrayBuffer,
		dataURItoUint8Array : dataURItoUint8Array,
		dataViewToString : dataViewToString,
		dataViewToByteArray : dataViewToByteArray,
		stringToArrayBuffer : stringToArrayBuffer,
		stringToByteArray : stringToByteArray
	};

})();