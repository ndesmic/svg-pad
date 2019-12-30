const AppService = (function(){

	const defaults = {
		cacheName : "app-shell",
		precacheUrls : []
	};

	function create(options){
		const appService = {};
		appService.options = { ...defaults, ...options };
		bind(appService);
		appService.init();
		return appService;
	}

	function bind(appService){
		appService.init = init.bind(appService);
		appService.attachEvents = attachEvents.bind(appService);
		appService.onInstall = onInstall.bind(appService);
		appService.onFetch = onFetch.bind(appService);
		appService.cacheResponse = cacheResponse.bind(appService);
	}

	function attachEvents(){
		self.addEventListener("install", this.onInstall);
		self.addEventListener("fetch", this.onFetch);
	}

	function onInstall(e){
		e.waitUntil(
			caches.open(this.options.cacheName)
				.then(cache => cache.addAll(this.options.precacheUrls))
		);
	}

	function onFetch(e){
		e.respondWith(
			fetch(e.request)
				.then(response => this.cacheResponse(e.request, response))
				.catch(() =>
					caches.match(e.request))
		);
	}

	function cacheResponse(request, response){
		if(!response || response.status !== 200 || response.type !== "basic"){
			return response;
		}

		const responseToCache = response.clone();

		caches.open(this.options.cacheName)
				.then(cache => cache.put(request, responseToCache));

		return response;
	}

	function init(){
		this.attachEvents();
	}

	return {
		create
	};

})();
