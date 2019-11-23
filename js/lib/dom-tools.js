export function empty(node){
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
}