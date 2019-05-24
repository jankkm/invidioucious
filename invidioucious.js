var settings = ""
let gettingItem = browser.storage.sync.get();
gettingItem.then(onGot, onError);

function onError(error) {
	console.log(`Error: ${error}`);
}

function onGot(item) {
	if (typeof item.settings === "object") {
		var nosettings=false;
		var noparameter=false;
		settings=item.settings;
	} else {
		var nosettings=true;
		settings = {
			url: "invidio.us",
			url_override: "",
			darkmode: false,
			thinmode: false,
			quality: "hd720",
			proxy: false,
			other: "",
			usecookie: false,
			parameter: ""
		};
	}
	var currurl = window.location.href;
	var newurl = currurl;
	if (settings.url_override.includes(".")) {
		var baseurl=settings.url_override;
	} else {
		var baseurl=settings.url;
	}
	if (newurl.includes(baseurl)) {
		if (!(nosettings) && document.cookie.includes("dark_mode") && !(item.temp.deletecookie)) {
			noparameter=true;
		} else if (!nosettings && ((item.temp.deletecookie) || (item.settings.usecookie == true && !document.cookie.includes("dark_mode")))) {
			browser.storage.sync.set({
			    temp: { 
					deletecookie: false
			    }
			});
			if (item.settings.usecookie == true) {
				//document.cookie = "PREFS=%7B%22video_loop%22%3Afalse%2C%22autoplay%22%3Afalse%2C%22continue%22%3Afalse%2C%22listen%22%3Afalse%2C%22local%22%3A"+settings.proxy+"%2C%22speed%22%3A1.0%2C%22quality%22%3A%22"+settings.quality+"%22%2C%22volume%22%3A100%2C%22comments%22%3A%5B%22youtube%22%2C%22%22%5D%2C%22captions%22%3A%5B%22%22%2C%22%22%2C%22%22%5D%2C%22related_videos%22%3Atrue%2C%22redirect_feed%22%3Afalse%2C%22locale%22%3A%22en-US%22%2C%22dark_mode%22%3A"+settings.darkmode+"%2C%22thin_mode%22%3A"+settings.thinmode+"%2C%22max_results%22%3A40%2C%22sort%22%3A%22published%22%2C%22latest_only%22%3Afalse%2C%22unseen_only%22%3Afalse%2C%22notifications_only%22%3Afalse%7D";
				var forcereload=true
			} else {
				document.cookie = 'PREFS=invidioucious;max-age=10';
			}
		} else if (newurl.substr(newurl.length - 5) == baseurl.substr(baseurl.length - 5)) {
			newurl=newurl+"/?";
		} else if (newurl.substr(newurl.length - 5) == baseurl.substr(baseurl.length - 4)+"/") {
			newurl=newurl+"?";
		}
	}
	if (newurl.includes("/results?q")) {
	    newurl=newurl.replace("/results?q", "/search?q");
	}
	if (newurl.includes("/results?search_query")) {
	    newurl=newurl.replace("/results?search_query", "/search?q");
	}
	if (!noparameter && !newurl.includes("quality")) {
		newurl=newurl//+settings.parameter;
	}
	if (currurl != newurl && !(noparameter)) {
		window.location=newurl;
	}
}
