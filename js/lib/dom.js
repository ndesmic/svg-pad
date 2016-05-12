var dom = (function(){
	
	//Manipulation
	function insertAfter(referenceNode, newNode) {
		referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	}
	
	function empty(node){
		while (node.hasChildNodes()) {
			node.removeChild(node.lastChild);
		}
	}

	//Group Manipulation
	function addEventListenerAll(elementArray, listener, handler){
		for(var i = 0; i < elementArray.length; i++){
			elementArray[i].addEventListener(listener, handler, true);
		}
	}

	function addClassAll(elementArray, class){
		for(var i = 0; i < elementArray.length; i++){
			elementArray[i].addEventListener(listener, handler, true);
		}
	}

	//Creation
	function createElement(element, text){
		var el = document.createElement(element);
		elementText(el, text);
		return el;
	}
	
	function elementText(el, text){
		if(el && text){
			el.innerText = text;
		}
	}
	
	var createDiv = createElement.bind(this, "div");
	var createSpan = createElement.bind(this, "span");
	var createListItem = createElement.bind(this, "li");
	var createTableCell = createElement.bind(this, "td");
	
	function createTextBox(){
		var textbox = document.createElement("input");
		textbox.attributes["type"] = "text";
		return textbox;
	}
	
	function createUnorderedList(listData){
		var ul = document.createElement("ul");
		if(listData){
			for(var i = 0; i < listData.length; i++){
				ul.appendChild(createLi);
			}
		}
		return ul;
	}
	
	function createListItem(text){
		var li = document.createElement("li");
		elementText(li, text);
		return li;
	}
	
	function createTable(tableData, headerData, columnData){
		var table = document.createElement("table");
		if(tableData){
			if(columnData){
				table.appendChild(createColumnGroup(columnData));
			}
			if(headerData){
				table.appendChild(createTableHead(headerData));
			}
			table.appendChild(createTableBody(tableData));
		}
		return table;
	}
	
	function createTableHead(headerData){
		var thead = document.createElement("thead");
		
		if(headerData){
			var tr = document.createElement("tr");
			
			for(var i = 0; i < headerData.length; i++){
				var th = document.createElement("th");
				th.innerText = headerData[i];
				tr.appendChild(th);
			}
			
			thead.appendChild(tr);
		}
	
		return thead;
	}
	
	function createColumnGroup(columnData){
		var colGroup = document.createElement("colgroup");
		for(var i = 0; i < columnData.length; i++){
			var col = document.createElement("colgroup");
			colGroup.appendChild(col);
		}
		return colGroup;
	}

	function createTableBody(tableData){
		var tbody = document.createElement("tbody");
		
		if(tableData){
			for(var i = 0; i < tableData.length; i++){
				tbody.appendChild(createRow(tableData[i]));
			}
		}
		
		return tbody;
	}

	function createRow(rowData){
		var row = document.createElement("tr");
		
		if(rowData){
			for(var key in rowData){
				row.appendChild(createCell(rowData[key]))
			}
		}
		
		return row;
	}
	
	function createCell(cellData){
		var cell = document.createElement("td");
		cell.innerText = cellData;
		return cell;
	}
	
	function getDomData(id){
		var el = document.getElementById(id);
		var text = el.innerText;
		var data = JSON.parse(text);
		return data;
	}
	
	return {
		insertAfter : insertAfter,
		empty : empty,
		createTextBox : createTextBox,
		createDiv : createDiv,
		createSpan : createSpan,
		createUnorderedList : createUnorderedList,
		createListItem : createListItem,
		createColumnGroup : createColumnGroup,
		createTable : createTable,
		createTableHead : createTableHead,
		createRow : createRow,
		createCell : createCell,
		createTableBody : createTableBody,
		getDomData : getDomData,
		//alias
		div : createDiv,
		span : createSpan,
		ul : createUnorderedList,
		li : createListItem,
		colgroup : createColumnGroup,
		table : createTable,
		thead : createTableHead,
		tr : createRow,
		td : createCell,
		tbody : createTableBody
	}

})();