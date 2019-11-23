function stringEndsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
function stringStartsWith(str, prefix) {
	return(str.indexOf(prefix) == 0);
}
function indent(level){
	var indentString = "";
	for(var i = 0; i < level; i++){
		indentString += String.fromCharCode(9);
	}
	return indentString;
}

export function prettyPrintXml(value){
	const tags = value.match(/<([^>]*)>/g);
	let indentLevel = 0;
	let lastTag = null;
	let output = "";

	value = value.replace(/\s/g, "");

	for(var i = 0; i < tags.length; i++){
		if(lastTag && (!stringStartsWith(lastTag, "</") && !stringEndsWith(lastTag, "/>"))){
			indentLevel++;
		}
		if(stringStartsWith(tags[i], "</")){
			indentLevel--;
		}
		output += indent(indentLevel) + tags[i] + "\n";
		lastTag = tags[i];
	}
	output = output.trim();

	return output;
}

