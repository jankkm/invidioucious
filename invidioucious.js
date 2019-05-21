let gettingItem = browser.storage.sync.get();
gettingItem.then(onGot, onError);

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
	if (item.settings.url_override.includes(".")) {
		baseurl = item.settings.url_override;
	} else {
		baseurl = item.settings.url;
	}
	
	var currurl = window.location.href;
	var newurl = currurl;
	if (currurl.includes("youtu")) {
		if(newurl.includes("m.youtube.com")){
		    newurl=newurl.replace("m.youtube.com", baseurl);
		}
		else if (newurl.includes("youtube")){
			newurl=newurl.replace("www.youtube.com", baseurl);
		}
		else if (newurl.includes("youtu.be")){
			newurl=newurl.replace("youtu.be/", baseurl + "/watch?v=");
		}
		else if (newurl.includes("youtube-nocookie")){
			newurl=newurl.replace("youtube-nocookie.com/", baseurl + "/");
		}

		if(newurl.includes("/results?q")){
		    newurl=newurl.replace("/results?q", "/search?q");
		}
		if(newurl.includes("/results?search_query")){
		    newurl=newurl.replace("/results?search_query", "/search?q");
		}

		if ( item.settings.darkmode == "on") {
			newurl=newurl+"&dark_mode=true";
		}
		if ( item.settings.thinmode == "on") {
			newurl=newurl+"&thin_mode=true";
		}
		if ( item.settings.quality == "dash") {
			newurl=newurl+"&quality=dash";
		} else {
			newurl=newurl+"&quality=720p";
		}
		if ( item.settings.other != "") {
			newurl=newurl+item.settings.other;
		}
		if ( item.settings.proxy == "on") {
			newurl=newurl+"&local=true";
		}
		window.location=newurl;
	} else if ((!newurl.includes("&dark_mode") && newurl.length > 30 && !document.cookie.includes("dark_mode")) || item.temp.deletecookie == "true" ) {
		browser.storage.sync.set({
		    temp: { 
				deletecookie: "false"
		    }
		});

		if ( item.settings.darkmode == "on") {
			newurl=newurl+"&dark_mode=true";
			var darkmodecookie = "true";
		} else {
			var darkmodecookie = "false";
		}
		if ( item.settings.thinmode == "on") {
			newurl=newurl+"&thin_mode=true";
			var thinmodecookie = "true";
		} else {
			var thinmodecookie = "false";
		}
		if ( item.settings.quality == "dash") {
			newurl=newurl+"&quality=dash";
			var qualitycookie = "dash";
		} else {
			newurl=newurl+"&quality=720p";
			var qualitycookie = "hd720";
		}
		if ( item.settings.other != "") {
			newurl=newurl+item.settings.other;
		}
		if ( item.settings.proxy == "on") {
			newurl=newurl+"&local=true";
			var localcookie = "true";
		} else {
			var localcookie = "false";
		}
		if ( item.settings.usecookie == true ) {
			document.cookie = "PREFS=%7B%22video_loop%22%3Afalse%2C%22autoplay%22%3Afalse%2C%22continue%22%3Afalse%2C%22listen%22%3Afalse%2C%22local%22%3A"+localcookie+"%2C%22speed%22%3A1.0%2C%22quality%22%3A%22"+qualitycookie+"%22%2C%22volume%22%3A100%2C%22comments%22%3A%5B%22youtube%22%2C%22%22%5D%2C%22captions%22%3A%5B%22%22%2C%22%22%2C%22%22%5D%2C%22related_videos%22%3Atrue%2C%22redirect_feed%22%3Afalse%2C%22locale%22%3A%22en-US%22%2C%22dark_mode%22%3A"+darkmodecookie+"%2C%22thin_mode%22%3A"+thinmodecookie+"%2C%22max_results%22%3A40%2C%22sort%22%3A%22published%22%2C%22latest_only%22%3Afalse%2C%22unseen_only%22%3Afalse%2C%22notifications_only%22%3Afalse%7D";
		} else if (document.cookie.includes("PREFS")) {
			document.cookie = 'PREFS=foobar;max-age=10';
		}
		window.location=newurl;
	}
}
