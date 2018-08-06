import { SvgPad } from "./views/svg-pad-app.js";

const loc = window.location.href;
if (loc.indexOf('http://') == 0 && loc.indexOf("localhost") == -1){
    window.location.href = loc.replace("http://","https://");
}
document.addEventListener("DOMContentLoaded", function(){
	SvgPad.create({
		dropbox : Dropbox.create({
			appName : "SVGPad",
			appKey : "1s3rbz0zdqy148u"
		})
	});
});
