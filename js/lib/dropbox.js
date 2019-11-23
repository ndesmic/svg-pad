export class Dropbox { 

	constructor(appName = "", appKey = ""){
		this.appName = appName;
		this.appKey = appKey;
		this.bind(this);
		this.checkToken();
	}

	bind(dropbox){
		dropbox.checkToken = this.checkToken.bind(dropbox);
		dropbox.authorize = this.authorize.bind(dropbox);
		dropbox.isAuthorized = this.isAuthorized.bind(dropbox);
		dropbox.download = this.download.bind(dropbox);
		dropbox.upload = this.upload.bind(dropbox);
	}

	authorize(){
		window.location.href = `https://www.dropbox.com/oauth2/authorize?response_type=token&client_id=${this.appKey}&redirect_uri=${window.location.href}`;
	}

	isAuthorized(){
		return localStorage.getItem(`${this.appName}-access_token`) && localStorage.getItem(`${this.appName}-uid`);
	}

	checkToken(){
		const params = new URLSearchParams(window.location.hash.substr(1));
		if(params.has("access_token")){
			this.token = params.get("access_token");
			this.uid = params.get("uid");
			localStorage.setItem(`${this.appName}-access_token`, this.token);
			localStorage.setItem(`${this.appName}-uid`, this.uid);
			//cleanup hash
			window.location.href.replace(/access_token=.*?&/, "");
			window.location.href.replace(/uid=.*?&/, "");
			window.location.href.replace(/token_type=.*?&/, "");
			window.location.href.replace(/account_id=.*?&/, "");
		}else{
			this.token = localStorage.getItem(`${this.appName}-access_token`);
			this.uid = localStorage.getItem(`${this.appName}-uid`);
		}
	}

	download(path){
		const arg = {
			path : path
		};
		return fetch("https://content.dropboxapi.com/2/files/download", {
			headers : new Headers({
				"Authorization" : `Bearer ${this.token}`,
				"Dropbox-API-Arg" : JSON.stringify(arg)
			}),
			method : "POST"
		});
	}

	upload(content, options){
		if(options.mode){
			options.mode = { ".tag" : options.mode };
		}
		if(options.path[0] !== "/"){
			options.path = "/" + options.path;
		}
		if(typeof(content) === "string"){
			content = stringToArrayBuffer(content);
		}
		return fetch("https://content.dropboxapi.com/2/files/upload", {
			headers : new Headers({
				"Authorization" : `Bearer ${this.token}`,
				"Dropbox-API-Arg" : JSON.stringify(options),
				"Content-Type" : "application/octet-stream"
			}),
			method : "POST",
			body : content
		});
	}

	stringToArrayBuffer(string){
		const arrayBuffer = new ArrayBuffer(string.length);
		const uInt8Array = new Uint8Array(arrayBuffer);

		for (let i = 0; i < string.length; i++) {
			uInt8Array[i] = string.charCodeAt(i);
		}

		return arrayBuffer;
	}
}
