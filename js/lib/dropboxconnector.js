var DropBoxConnector = (function(){

	function create(options){
		var dbc = {};
		dbc.consumerKey = options.consumerKey;
		dbc.consumerSecret = options.consumerSecret;
		dbc.baseDirectory = options.baseDirectory || "";
		dbc.dropbox = DropBox.create({ consumerKey : dbc.consumerKey, consumerSecret : dbc.consumerSecret });
		dbc.save = save.bind(dbc);
		dbc.doAuth = doAuth.bind(dbc);
		dbc.doSave = doSave.bind(dbc);
		return dbc;
	}
	
	function save(blob, name, callback){
		var self = this;
		if(!self.dropbox.oauth.hasAuth()){
			self.doAuth(function(){
				self.doSave(name, blob, callback);
			});
		}else{
			self.doSave(name, blob, callback);
		}
	}
	
	function doSave(name, file, callback){
		var self = this;
		name = self.baseDirectory + name;
		self.dropbox.files.put("dropbox", name, file, callback);
	}
	
	function doAuth(callback){
		var self = this;
		self.dropbox.oauth.requestToken(function(){
			self.dropbox.oauth.authorize(function(){
				self.dropbox.oauth.accessToken(callback);
			});
		});
	}

	return {
		create : create
	};

})();