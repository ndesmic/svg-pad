var Lightbox = (function(){

	var isOpen = false;

	function open(html){
		if(!isOpen){
			$(document.body).append("<div id='lightbox'><button class='close'></button>" + html + "</div>");
			$("#lightbox .close").on("click", close);
			isOpen = true;
		}
	}
	
	function close(){
		$("#lightbox").remove();
		isOpen = false;
	}
	
	function openWith(templateUrl, templateDate, callback){
		ajax.request({
			url : template,
			success : getTemplateComplete.bind(this, callback)
		});
	}
	
	function getTemplateComplete(callback, data){
		open(data);
		callback();
	}

	return{
		open : open,
		openWith : openWith
	}

})();