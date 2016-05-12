var util = (function(){
	function stringEndsWith(str, suffix) {
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}

	function download(url, fileName){
		var link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		link.click();
	}

	function createDocument(cssUrl, svg){
		var doc = `
		<!doctype html>
		<html>
			<head>
				<title>svg</title>
				<link rel="stylesheet" href="${cssUrl}" />
			</head>
			<body>
			${svg}
			</body>
		</html>`;
		return doc;
	}

	function normalizeFileName(fileName){
		fileName = fileName || "new_svg.svg";
		var dotSplit = fileName.split(".");
		if(dotSplit.length == 0 || dotSplit[dotSplit.length - 1] != "svg"){
			fileName += ".svg";
		}
		return fileName;
	}

	return {
		stringEndsWith : stringEndsWith,
		download : download,
		createDocument: createDocument,
		normalizeFileName : normalizeFileName
	};
})();
