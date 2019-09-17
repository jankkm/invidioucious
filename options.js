const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function saveOptions(e) {
  e.preventDefault();
  if (document.querySelector("#url_override").value.includes(".")) {
    var baseurl=document.querySelector("#url_override").value;
  } else {
    var baseurl=document.querySelector("#url").value;
  }
  var parameter = "";
  if (document.querySelector("#darkmode").checked) { parameter = parameter+"&dark_mode=true" };
  if (document.querySelector("#thinmode").checked) { parameter = parameter+"&thin_mode=true" };
  if (document.querySelector("#autoplay").checked) { parameter = parameter+"&autoplay=true" };
  if (document.querySelector("#autoplaynext").checked) { parameter = parameter+"&continue=true" };
  if (document.querySelector("#alwaysloop").checked) { parameter = parameter+"&video_loop=true" };
  if (document.querySelector("#listenbydefault").checked) { parameter = parameter+"&listen=true" };
  if (document.querySelector("#autoplaynext").checked) { parameter = parameter+"&continue=true" };
  if (document.querySelector("#proxy").checked) { parameter = parameter+"&local=true" };
  parameter = parameter+"&quality="+document.querySelector("#quality").value;
  parameter = parameter+"&hl="+document.querySelector("#language").value;
  if (document.querySelector("#other").value == "") {
    parameter = parameter;
  } else if (document.querySelector("#other").value.charAt(0) == "&") {
    parameter = parameter+document.querySelector("#other").value;
  } else {
    parameter = parameter+"&"+document.querySelector("#other").value;
  }
  parameter = parameter.substr(parameter.length - (parameter.length -1 ));

  var currsettings = {
    url: document.querySelector("#url").value,
    baseurl: baseurl,
    url_override: document.querySelector("#url_override").value,
    darkmode: document.querySelector("#darkmode").checked,
    thinmode: document.querySelector("#thinmode").checked,
    alwaysloop: document.querySelector("#alwaysloop").checked,
    autoplay: document.querySelector("#autoplay").checked,
    autoplaynext: document.querySelector("#autoplaynext").checked,
    listenbydefault: document.querySelector("#listenbydefault").checked,
    quality: document.querySelector("#quality").value,
    language: document.querySelector("#language").value,
    proxy: document.querySelector("#proxy").checked,
    other: document.querySelector("#other").value,
    usecookie: document.querySelector("#usecookie").checked,
    parameter: parameter,
    cookie: "PREFS=%7B%22video_loop%22%3A"+document.querySelector("#alwaysloop").checked+"%2C%22autoplay%22%3A"+document.querySelector("#autoplay").checked+"%2C%22continue%22%3A"+document.querySelector("#autoplaynext").checked+"%2C%22listen%22%3A"+document.querySelector("#listenbydefault").checked+"%2C%22local%22%3A"+document.querySelector("#proxy").checked+"%2C%22speed%22%3A1.0%2C%22quality%22%3A%22"+document.querySelector("#quality").value+"%22%2C%22volume%22%3A100%2C%22comments%22%3A%5B%22youtube%22%2C%22%22%5D%2C%22captions%22%3A%5B%22%22%2C%22%22%2C%22%22%5D%2C%22related_videos%22%3Atrue%2C%22redirect_feed%22%3Afalse%2C%22locale%22%3A%22"+document.querySelector("#language").value+"%22%2C%22dark_mode%22%3A"+document.querySelector("#darkmode").checked+"%2C%22thin_mode%22%3A"+document.querySelector("#thinmode").checked+"%2C%22max_results%22%3A40%2C%22sort%22%3A%22published%22%2C%22latest_only%22%3Afalse%2C%22unseen_only%22%3Afalse%2C%22notifications_only%22%3Afalse%7D"
  }
  browser.storage.local.set({
    settings: currsettings
  });
  browser.storage.sync.set({
    settings: currsettings
  });
  document.getElementById("saved").style["display"] = "";
  sleep(1500).then(() => {
    document.getElementById("saved").style["display"] = "none";
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.getElementById("url").value = result.settings.url || "invidio.us";
    document.querySelector("#url_override").value = result.settings.url_override || "";
    document.getElementById("darkmode").checked = result.settings.darkmode || false;
    document.getElementById("thinmode").checked = result.settings.thinmode || false;
    document.getElementById("alwaysloop").checked = result.settings.alwaysloop || false;
    document.getElementById("autoplay").checked = result.settings.autoplay || false;
    document.getElementById("autoplaynext").checked = result.settings.autoplaynext || false;
    document.getElementById("listenbydefault").checked = result.settings.listenbydefault || false;
    document.querySelector("#quality").value = result.settings.quality || "hd720";
    document.querySelector("#language").value = result.settings.language || "en-US";
    document.getElementById("proxy").checked = result.settings.proxy || false;
    document.querySelector("#other").value = result.settings.other || "";
    //document.querySelector("#usecookie").checked = result.settings.usecookie || false;
    document.getElementById("usecookie").checked = result.settings.usecookie || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("settings");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
