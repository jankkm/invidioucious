var settings = "";
var baseurl="";
var disabled=false
getsettings();
function getsettings() {
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
			browser.storage.local.set({
			    settings: currsettings,
			    temp: { deletecookie: true }
			});
			browser.storage.sync.set({
			    settings: currsettings,
			    temp: { deletecookie: true }
			});
			settings = currsettings;
		}
		baseurl = settings.baseurl;
	}
}

function redirect(requestDetails) {
	if (!disabled){
		var currurl=requestDetails.url;
		var newurl=currurl;
		if(newurl.includes("youtube.com") || newurl.includes("youtube-nocookie.com")){
	    	newurl=newurl.replace("m.youtube.com", settings.baseurl);
	    	newurl=newurl.replace("www.youtube.com", settings.baseurl);
	    	newurl=newurl.replace("www.youtube-nocookie.com", settings.baseurl);
	    	newurl=newurl.replace("youtube-nocookie.com", settings.baseurl);
	    	newurl=newurl.replace("youtube.com", settings.baseurl);
	    	newurl=newurl.replace("/results?q", "/search?q");
	    	newurl=newurl.replace("/results?search_query", "/search?q");
		} else if (newurl.includes("youtu.be/")){
			newurl=newurl.replace("youtu.be/", settings.baseurl + "/watch?v=");
		} else if (currurl.includes(settings.baseurl) && !settings.usecookie && !newurl.includes("&quality=")) {
			if (newurl.substr(newurl.length - 5) == settings.baseurl.substr(settings.baseurl.length - 5)) {
				newurl=newurl+"/?";
			} else if (newurl.substr(newurl.length - 5) == settings.baseurl.substr(settings.baseurl.length - 4)+"/") {
				newurl=newurl+"?";
			}
		}
		if (!settings.usecookie && !newurl.includes("&quality=")) {
				newurl=newurl+settings.parameter;
		  	}
	 	if (currurl != newurl) {
		  	return {
		    	redirectUrl: newurl
		  	};
		}
	}
}

function check_settings () {
	getsettings();
}

function cookie_header(e) {
	if (!disabled) {
		var cookieslot = Object.keys(e.requestHeaders).length;
		if (e.url.includes(settings.baseurl) && settings.usecookie) {
			e.requestHeaders.forEach(function(header){
				if (header.name.toLowerCase() == "cookie") {
					console.log("found cookie");
					header.value = settings.cookie;
				}
			});
			if (!e.requestHeaders.includes("Cookie")) {
			 	e.requestHeaders[cookieslot] = ({
			 		name: "Cookie",
			 		value: settings.cookie
			 	});
			}
			return {requestHeaders: e.requestHeaders};
		}
	}
}

function buttonClicked() {
	if(!disabled) {
		disabled=true;
		browser.browserAction.setBadgeText({text: "Off"});
	} else {
		disabled=false;
		browser.browserAction.setBadgeText({text: ""});
	}
	
}

browser.webRequest.onBeforeRequest.addListener(
	redirect,
	{urls:["<all_urls>"], types: ["main_frame"]},
	["blocking"]
);

browser.storage.onChanged.addListener(check_settings);

browser.webRequest.onBeforeSendHeaders.addListener(
  cookie_header,
  {urls: ["<all_urls>"], types: ["main_frame"]},
  ["blocking", "requestHeaders"]
);

browser.browserAction.onClicked.addListener(buttonClicked);
