let gettingItem = browser.storage.sync.get();
gettingItem.then(onGot, onError);

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGot(item) {
	if (item.settings.url.includes(".")) {
		baseurl = item.settings.url;
	} else {
		baseurl = "invidio.us";
	}
	
	var currurl = window.location.href;
	var newurl = currurl;

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
}
