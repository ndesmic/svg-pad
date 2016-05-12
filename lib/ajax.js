var ajax = (function(){

	function request(settings){
		var async = settings.async == undefined ? true : settings.async;
		var url = settings.url || "";
		var method = settings.method || "GET";
		var data = settings.data;
		var dataType = settings.dataType;
		var shouldSortData = settings.shouldSortData;
		var shouldNotProcessData = settings.shouldNotProcessData;
		var success = settings.success || function(data){ console.log(data);};
		var error = settings.error || function(status){ console.error("Ajax " + method + " ERROR. Status: " + status + " for URL: " + url);};
	
		var request = new XMLHttpRequest();
		if(method == "GET"){
			url += "?" + objectToQueryString(data, shouldSortData);
		}
		
		request.open(method, url, async);
		
		request.onreadystatechange = function(){
			if(request.readyState == 4){
				if(request.status == 200){
					success(request.responseText);
					request.onreadystatechange = function(){};
				}else{
					error(request.status);
					request.onreadystatechange = function(){};
				}
			}
		}
		
		if(data && dataType){
			request.setRequestHeader("Content-Type", getMimeType(dataType));
		}
		
		if(method != "GET" && data){
			var sendData = shouldNotProcessData ? data : objectToQueryString(data, shouldSortData);
			request.send(sendData);
		}else{
			request.send();
		}
	}
	
	function getMimeType(type){
		var mimeType = "";
		switch(type){
			case "form":
				mimeType = "application/x-www-form-urlencoded";
				break;
			case "form-multipart":
				mimeType = "multipart/form-data";
				break;
			case "text":
				mimeType = "text/plain";
				break;
			default:
				mimeType = "application/x-www-form-urlencoded";
		}
		
		return mimeType;
	}
	
	function objectToQueryString(obj, sort){
		var queryArray = [];
		var query = "";
		for(var key in obj){
			queryArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
		}
		
		if(sort){
			queryArray = queryArray.sort();
		}
		
		for(var i = 0; i < queryArray.length; i++){
			query += queryArray[i] + "&";
		}
		
		return query.substring(0, query.length - 1);
	}
	
	return {
		getMimeType : getMimeType,
		request : request,
		objectToQueryString : objectToQueryString
	};

})();