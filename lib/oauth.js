var oauth = (function(){
	
	var signMethods = {
		SHA1 : "HMAC-SHA1",
		PLAINTEXT : "PLAINTEXT"
	};
	
	var oauthToken;
	var oauthTokenSecret;
	
	function getOauthTimestamp(){
		return Math.floor(new Date().getTime() / 1000);
	}
	
	function getNonce(){
		return 'Q' + getOauthTimestamp() + "ZZ";
	}
		
	function createKey(consumerSecret, tokenSecret){
		var encodedConsumerSecret = consumerSecret ? encodeURIComponent(consumerSecret) : "";
		var encodedTokenSecret = tokenSecret ? encodeURIComponent(tokenSecret) : "";
		
		return encodedConsumerSecret + "&" + encodedTokenSecret;
	}
	
	function createOauthSignature(oauthObj, url, oauthkey){
		switch(options.signMethod){
			case signType.SHA1:
				return createOauthSignFromHashFunction();
			case signType.PLAINTEXT:
				return createOauthSignPlaintext();
		}
	}
	
	function queryStringToObject(data){
		var querystringSplit = data.split("&");
		var querystringObject = {};
		for(var i = 0; i < querystringSplit.length; i++){
			var keyValueSplit = querystringSplit[i].split("=");
			var key = decodeURIComponent(keyValueSplit[0]);
			var value = decodeURIComponent(keyValueSplit[1]);
			querystringObject[key] = value;
		}
		return querystringObject;
	}
	
	function objectToQueryString(obj){
		var queryArray = [];
		var query = "";
		for(var key in obj){
			queryArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
		}
		
		queryArray = queryArray.sort();
		
		for(var i = 0; i < queryArray.length; i++){
			query += queryArray[i] + "&";
		}
		
		return query.substring(0, query.length - 1);
	}
	
	function createSignedRequest(requestObject, url, httpMethod, key){
		var baseString = constructBaseString(requestObject, url, httpMethod, key);
		var signature = getSignature(baseString, key);
		
		requestObject.oauth_signature = signature;
		
		return requestObject;
	}
	
	function constructBaseString(requestObject, url, httpMethod){		
		var paramString = objectToQueryString(requestObject);
		
		var httpMethod = encodeURIComponent(httpMethod);
		var paramString = encodeURIComponent(paramString);
		var encodedUrl = encodeURIComponent(url);
		
		return baseString = httpMethod + "&"  + encodedUrl +  "&" + paramString;
	}
	
	function getSignature(baseString, key){
		var signatureHashBytes = Crypto.HMAC(Crypto.SHA1, baseString, key, { asBytes: true });
		var signatureHashString = byteArrayToString(signatureHashBytes);
		var signature = btoa(signatureHashString);
		
		return signature;
	}
	
	function byteArrayToString(array){
		var str = "";
		for(var i = 0; i < array.length; i++){
			str += String.fromCharCode(array[i]);
		}
		return str;
	}
	
	function createOauthSignPlaintext(){
		console.log(oauthkey);
		oauthObj.oauth_signature = encodeURIComponent(oauthkey);
		return oauthObj;
	}
	
	function tokenRequestAndAuthorize(requestUrl, authorizeUrl, consumerKey, consumerSecret){
		var oauthRequest = {
			oauth_consumer_key: consumerKey,
			oauth_signature_method: options.signMethod,
			oauth_timestamp: getOauthTimestamp(),
			oauth_nonce: getNonce(),
			oauth_version: "1.0"
		};
		
		oauthRequest = createSignedRequest(oauthRequest, requestUrl, createKey(consumerSecret));
		
		var tokenRequestReturnData;
		
		var ajax = $.ajax({
			type: options.HttpMethod,
			url : requestUrl,
			data: oauthRequest,
			success: function(data){
				tokenRequestReturnData = querystringToObject(data);
				window.open(url + "?oauth_token=" + tokenRequestReturnData.oauth_token + "&oauth_callback=" + encodeURIComponent(window.location.href));
			},
			error: function(data){
				console.log(data.responseText);
			}
		});
	}
	
	function request(options){
		var url = options.url;
		var consumerKey = options.consumerKey;
		var consumerSecret = options.consumerSecret;
		var data = options.data;
		var dataType = options.dataType;
		var oauthToken = options.oauthToken;
		var oauthTokenSecret = options.oauthTokenSecret;
		var oauthAsGet = options.oauthAsGet || false;
		var method = options.method || "POST";
		var success = options.success || function(){};
		var signMethod = options.signMethod || signMethods.SHA1;
	
		var oauthRequest = {
			oauth_consumer_key: consumerKey,
			oauth_signature_method: signMethod,
			oauth_timestamp: getOauthTimestamp(),
			oauth_nonce: getNonce(),
			oauth_version: "1.0"
		};
		
		if(oauthToken){
			oauthRequest.oauth_token = oauthToken;
		}
		
		var key = createKey(consumerSecret, oauthTokenSecret);
		oauthSignedRequest = createSignedRequest(oauthRequest, url, method, key);
		
		var request = {
			url : url,
			method : method,
			data : oauthSignedRequest,
			dataType : dataType,
			shouldSortData : true,
			success : success
		}
		
		if(oauthAsGet){
			request.url = request.url + "?" + objectToQueryString(oauthSignedRequest);
			request.data = data;
			request.shouldNotProcessData = true;
		}
		
		ajax.request(request);
	}
	
	return {
		request : request,
		queryStringToObject : queryStringToObject,
		objectToQueryString : objectToQueryString,
		signMethods : signMethods,
		_private : {
			createKey : createKey,
			constructBaseString : constructBaseString,
			createSignedRequest : createSignedRequest,
			getNonce : getNonce,
			getOauthTimestamp : getOauthTimestamp,
			getSignature : getSignature
		}
	};
	
})();