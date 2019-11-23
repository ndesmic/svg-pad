export function stringEndsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function download(url, fileName){
	const link = document.createElement("a");
	link.href = url;
	link.download = fileName;
	link.click();
}

export function createDocument(cssUrl, svg){
	return `
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
}

export function normalizeFileName(fileName){
	fileName = fileName || "new_svg.svg";
	const dotSplit = fileName.split(".");
	if(dotSplit.length == 0 || dotSplit[dotSplit.length - 1] != "svg"){
		fileName += ".svg";
	}
	return fileName;
}

export function arrayTakeBy(array, count){
	const result = [];
	for(let i = 0; i < array.length; i += count){
		const tuple = [];
		for(let j = 0; j < count; j++){
			tuple.push(array[i + j]);
		}
		result.push(tuple);
	}

	return result;
}

export function parseSvgPoints(pointsString) {
	return arrayTakeBy(pointsString.split(/[,\s]/)
		.map(term => term.trim())
		.filter(term => term != ""), 2);
}

const domParser = new DOMParser();
export function parseXml(xmlString) {
	return domParser.parseFromString(xmlString, "text/xml");
}