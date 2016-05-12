var DropBox = (function(){
	
	//constants
	var dbRoot = "https://api.dropbox.com/";
	var dbContentRoot = "https://api-content.dropbox.com/";
	var dbVersion = 1;
	
	function create(options){
		var db = {};
		db.consumerKey = options.consumerKey;
		db.consumerSecret = options.consumerSecret;
		db.uIdStorageKey = options.uIdStorageKey || "dbUserId";
		db.tokenStorageKey = options.tokenStorageKey || "dbOauthToken";
		db.tokenSecretStorageKey = options.tokeSecretStorageKey || "dbOauthTokenSecret";
		db.oauthToken = localStorage.getItem(db.tokenStorageKey);
		db.oauthTokenSecret = localStorage.getItem(db.tokenSecretStorageKey);
		db.userId = localStorage.getItem(db.uIdStorageKey);
		db.authWindow = null;
		db.authCallback = null;
		
		db.getOauthParams = getOauthParams.bind(db);
		
		db.oauth = {
			hasAuth : oauth_hasAuth.bind(db),
			requestToken : oauth_requestToken.bind(db),
			authorize : oauth_authorize.bind(db),
			accessToken : oauth_accessToken.bind(db)
		};
		
		db.account = {
			info : account_info.bind(db)
		};
		
		db.files = {
			get : files_get.bind(db),
			put : files_put.bind(db)
		};
		
		db.metadata = metadata.bind(db);
		
		attachEvents(db);
		checkAuthLanding();
		
		return db;
	}
	
	function oauth_hasAuth(){
		var self = this;
		return self.oauthToken && self.oauthTokenSecret && self.userId;
	}
	
	function attachEvents(db){
		window.addEventListener("message", getAuthRedirect.bind(db), false);
	}
	
	function getAuthRedirect(event){
		var db = this;
		if(event.origin == window.location.origin){
			db.userId = event.data.dbUserId;
			localStorage.setItem(db.uIdStorageKey, db.userId);
			db.authWindow.close();
			if(db.authCallback){
				db.authCallback(event.data);
				db.authCallback = null;
			}
		}
	}
	
	function checkAuthLanding(){
		var queryData = oauth.queryStringToObject(window.location.search.substr(1));
		if(queryData.uid && queryData.oauth_token){ //have been redirected and this is sub window
			window.opener.postMessage({ dbUserId : queryData.uid, dbOauthToken : queryData.oauth_token }, window.location.href);
		}
	}
	
	function getUrl(object, action){
		var url =  dbRoot + dbVersion + "/" + object 
		if(action){
			url += "/" + action;
		}
		return url;
	}
	
	function getContentUrl(object){
		return dbContentRoot + dbVersion + "/" + object + "/";
	}
	
	function getOauthParams(data, callback){
		var self = this;
		data = oauth.queryStringToObject(data)
		self.oauthToken = data.oauth_token;
		self.oauthTokenSecret = data.oauth_token_secret;
		localStorage.setItem(self.tokenStorageKey, self.oauthToken);
		localStorage.setItem(self.tokenSecretStorageKey, self.oauthTokenSecret);
		callback(data);
	}
	
	function oauth_requestToken(callback){
		var self = this;
		oauth.request({
			url : getUrl("oauth", "request_token"), 
			consumerKey : self.consumerKey, 
			consumerSecret : self.consumerSecret,
			dataType : "form",
			method : "POST",
			success : function(data){
				self.getOauthParams(data, callback);
			}
		});
	}
	
	function oauth_authorize(callback){
		var self = this;
		var queryString = oauth.objectToQueryString({
			oauth_token : self.oauthToken,
			oauth_callback : window.location.href
		});
		self.authCallback = callback;
		self.authWindow = window.open(getUrl("oauth", "authorize") + "?" + queryString);
	}
	
	function oauth_accessToken(callback){
		var self = this;
		oauth.request({
			url : getUrl("oauth", "access_token"), 
			consumerKey : self.consumerKey, 
			consumerSecret : self.consumerSecret,
			dataType : "form",
			oauthToken : self.oauthToken,
			oauthTokenSecret : self.oauthTokenSecret,
			method : "POST",
			success : function(data){
				self.getOauthParams(data, callback);
			}
		});
	}
	
	function account_info(callback){
		var self = this;
		oauth.request({
			url : getUrl("account", "info"), 
			consumerKey : self.consumerKey, 
			consumerSecret : self.consumerSecret,
			dataType : "form",
			oauthToken : self.oauthToken,
			oauthTokenSecret : self.oauthTokenSecret,
			method : "GET",
			success : function(data){
				callback(JSON.parse(data));
			}
		});
	}
	
	//Needs params
	function files_get(root, path, callback){
		var self = this;
		oauth.request({
			url : getContentUrl("files") + root + "/" + path, 
			consumerKey : self.consumerKey, 
			consumerSecret : self.consumerSecret,
			oauthToken : self.oauthToken,
			oauthTokenSecret : self.oauthTokenSecret,
			method : "GET",
			success : function(data){
				callback(data);
			}
		});
	}
	
	//Needs params
	function files_put(root, path, content, callback){
		var self = this;
		oauth.request({
			url : getContentUrl("files_put") + root + "/" + path, 
			consumerKey : self.consumerKey, 
			consumerSecret : self.consumerSecret,
			data : content,
			oauthToken : self.oauthToken,
			oauthTokenSecret : self.oauthTokenSecret,
			oauthAsGet : true,
			method : "POST",
			success : function(data){
				callback(JSON.parse(data));
			}
		});
	}
	
	//Needs params
	function metadata(root, path, callback){
		var self = this;
		oauth.request({
			url : getUrl("metadata") + root + "/" + path, 
			consumerKey : self.consumerKey, 
			consumerSecret : self.consumerSecret,
			oauthToken : self.oauthToken,
			oauthTokenSecret : self.oauthTokenSecret,
			method : "GET",
			success : function(data){
				callback(JSON.parse(data));
			}
		});
	}
	
	return {
		create : create
	};
})();