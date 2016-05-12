document.addEventListener("DOMContentLoaded", function(){
	SvgPad.create({
		dbc : DropBoxConnector.create({
			consumerKey : 'ekbdyt654jkdhv0', 
			consumerSecret : 'tvfqw2jz485b3tp',
			baseDirectory : "public/svg/"
		})
	});
});