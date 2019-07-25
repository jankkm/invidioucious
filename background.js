var settings = "";
var baseurl="";
var disabled=false
getsettings();

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
			settings = currsettings;
		}
		baseurl = settings.baseurl;
	}
}

function redirect(requestDetails) {
	if (!disabled) {
		var currurl=requestDetails.url;
		var newurl=currurl;
		var yt=false;
		if (newurl.includes("inv-redirect=0")) {
			console.log("nothing");
		} else if (newurl.includes("youtube.com") || newurl.includes("youtube-nocookie.com")){
			yt=true;
	    	newurl=newurl.replace("m.youtube.com", settings.baseurl);
	    	newurl=newurl.replace("www.youtube.com", settings.baseurl);
	    	newurl=newurl.replace("www.youtube-nocookie.com", settings.baseurl);
	    	newurl=newurl.replace("youtube-nocookie.com", settings.baseurl);
	    	newurl=newurl.replace("youtube.com", settings.baseurl);
	    	newurl=newurl.replace("/results?q", "/search?q");
	    	newurl=newurl.replace("/results?search_query", "/search?q");
		} else if (newurl.includes("youtu.be/")){
			yt=true;
			newurl=newurl.replace("youtu.be/", settings.baseurl + "/watch?v=");
		} else if (currurl.includes(settings.baseurl) && !settings.usecookie && !newurl.includes("&quality=")) {
			yt=true;
			if (newurl.substr(newurl.length - 5) == settings.baseurl.substr(settings.baseurl.length - 5)) {
				newurl=newurl+"/?";
			} else if (newurl.substr(newurl.length - 5) == settings.baseurl.substr(settings.baseurl.length - 4)+"/") {
				newurl=newurl+"?";
			}
		}
		if (!settings.usecookie && !newurl.includes("&quality=") && yt) {
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
		browser.browserAction.setBadgeTextColor({color: "white"});
		browser.browserAction.setBadgeBackgroundColor({color: "red"});
		browser.browserAction.setBadgeText({text: "Off"});
		browser.browserAction.setTitle({title: "Enable Invidious Redirect"});
	} else {
		disabled=false;
		browser.browserAction.setBadgeTextColor({color: "white"});
		browser.browserAction.setBadgeBackgroundColor({color: "green"});
		browser.browserAction.setBadgeText({text: "On"});
		sleep(1500).then(() => {
    		browser.browserAction.setBadgeBackgroundColor({color: "red"});
			browser.browserAction.setBadgeText({text: ""});
		});
		browser.browserAction.setTitle({title: "Disable Invidious Redirect"});
	}
	
}


function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    // Just change any instance of Example in the HTTP response
    // to WebExtension Example.
    str = str.replace(/src=\"https:\/\/www.youtube.com\/embed\//g, 'src=\"https:\/\/invidious.enkirton.net\/embed\/');
    str = str.replace(/src=\"https:\/\/www.youtube-nocookie.com\/embed\//g, 'src=\"https:\/\/invidious.enkirton.net\/embed\/');
    str = str.replace(/src=\"http:\/\/www.youtube.com\/embed\//g, 'src=\"https:\/\/invidious.enkirton.net\/embed\/');
    str = str.replace(/src=\"http:\/\/www.youtube-nocookie.com\/embed\//g, 'src=\"https:\/\/invidious.enkirton.net\/embed\/');
    filter.write(encoder.encode(str));
    filter.disconnect();
  }
  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["<all_urls>"], types: ["main_frame"]},
  ["blocking"]
);

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
