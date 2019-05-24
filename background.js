var settings = "";
var baseurl = "";
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
			settings = {
				url: "invidio.us",
				url_override: "",
				darkmode: false,
				thinmode: false,
				quality: "hd720",
				proxy: false,
				other: "",
				usecookie: false,
				parameter: "",
				cookie: ""
			};
		}
		if (settings.url_override.includes(".")) {
			baseurl=settings.url_override;
			//settings["usecookie"] = false;
		} else {
			baseurl=settings.url;
		}
	}
}

function redirect_youtube(requestDetails) {
	var currurl=requestDetails.url;
	var newurl=currurl;
	if(newurl.includes("youtube.com") || newurl.includes("youtube-nocookie.com")){
    	newurl=newurl.replace("m.youtube.com", baseurl);
    	newurl=newurl.replace("www.youtube.com", baseurl);
    	newurl=newurl.replace("www.youtube-nocookie.com", baseurl);
    	newurl=newurl.replace("youtube-nocookie.com", baseurl);
    	newurl=newurl.replace("youtube.com", baseurl);
	} else if (newurl.includes("youtu.be/")){
		newurl=newurl.replace("youtu.be/", baseurl + "/watch?v=");
	}
	if (newurl.includes("/results?q")) {
	    newurl=newurl.replace("/results?q", "/search?q");
	}
	if (newurl.includes("/results?search_query")) {
	    newurl=newurl.replace("/results?search_query", "/search?q");
	}
	if (!settings.usecookie) {
		newurl=newurl+settings.parameter;
  	}
 	//newurl=newurl+settings.parameter
  	return {
    	redirectUrl: newurl
  	};
}

function redirect_invidious(requestDetails) {
	var currurl=requestDetails.url;
	var newurl=currurl;
	if (!settings.usecookie && !newurl.includes("quality")) {
		console.log(newurl);
		console.log(baseurl);
		if (newurl.substr(newurl.length - 5) == baseurl.substr(baseurl.length - 5)) {
			newurl=newurl+"/?";
		} else if (newurl.substr(newurl.length - 5) == baseurl.substr(baseurl.length - 4)+"/") {
			newurl=newurl+"?";
		}
		newurl=newurl+settings.parameter;
	}
	if (currurl != newurl) {
	  	return {
	    	redirectUrl: newurl
	  	};
	  }
}

function check_settings () {
	getsettings();
}

function cookie_header(e) {
	var cookieslot = Object.keys(e.requestHeaders).length;
	if (settings.usecookie) {
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
	}
	return {requestHeaders: e.requestHeaders};
}

browser.webRequest.onBeforeRequest.addListener(
	redirect_youtube,
	{urls:["*://*.youtube.com/*", "*://*.youtube-nocookie.com/*", "*://*.youtu.be/*"]},
	["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
	redirect_invidious,
	{urls:["*://*."+baseurl+"/*"], types: ["main_frame"]},
	["blocking"]
);

browser.storage.onChanged.addListener(check_settings);

browser.webRequest.onBeforeSendHeaders.addListener(
  cookie_header,
  {urls: ["*://*."+baseurl+"/*"], types: ["main_frame"]},
  ["blocking", "requestHeaders"]
);
