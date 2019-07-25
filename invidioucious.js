let gettingItem = browser.storage.local.get();
gettingItem.then(onGot, onError);

function onError(error) {
	console.log(`Error: ${error}`);
}

function onGot(item) {
	if (typeof item.settings === "object") {
		settings=item.settings
	} else {
		var currsettings = {
			url: "invidio.us",
			url_override: "",
			baseurl: "invidio.us",
			darkmode: false,
			thinmode: false,
			alwaysloop: false,
			autoplay: false,
			autoplaynext: false,
			listenbydefault: false,
			quality: "hd720",
			proxy: false,
			other: "",
			usecookie: true,
			parameter: "",
			cookie: "PREFS=%7B%22video_loop%22%3Afalse%2C%22autoplay%22%3Afalse%2C%22continue%22%3Afalse%2C%22listen%22%3Afalse%2C%22local%22%3Afalse%2C%22speed%22%3A1.0%2C%22quality%22%3A%22hd720%22%2C%22volume%22%3A100%2C%22comments%22%3A%5B%22youtube%22%2C%22%22%5D%2C%22captions%22%3A%5B%22%22%2C%22%22%2C%22%22%5D%2C%22related_videos%22%3Atrue%2C%22redirect_feed%22%3Afalse%2C%22locale%22%3A%22en-US%22%2C%22dark_mode%22%3Afalse%2C%22thin_mode%22%3Afalse%2C%22max_results%22%3A40%2C%22sort%22%3A%22published%22%2C%22latest_only%22%3Afalse%2C%22unseen_only%22%3Afalse%2C%22notifications_only%22%3Afalse%7D"
		}
		settings = currsettings;
	}
	var baseurl = settings.baseurl;
	var currurl = window.location.href;
	if ( currurl.includes(baseurl) ) {
		var aTags = document.getElementsByTagName("a");
		var searchText = "Watch on YouTube";
		var found;
		for (var i = 0; i < aTags.length; i++) {
			if (aTags[i].textContent == searchText) {
				found = aTags[i];
		    	break;
		  	}
		}
		found.attributes.href.nodeValue = found.attributes.href.nodeValue + "&inv-redirect=0";
	}
}
