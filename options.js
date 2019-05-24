const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function saveOptions(e) {
  e.preventDefault();
  var currsettings = {
    url: document.querySelector("#url").value,
    baseurl: document.querySelector("#url").value,
    url_override: document.querySelector("#url_override").value,
    darkmode: document.querySelector("#darkmode").checked,
    thinmode: document.querySelector("#thinmode").checked,
    quality: document.querySelector("#quality").value,
    proxy: document.querySelector("#proxy").checked,
    other: document.querySelector("#other").value,
    usecookie: document.querySelector("#usecookie").checked,
    parameter: "&dark_mode="+document.querySelector("#darkmode").checked+"&thin_mode="+document.querySelector("#thinmode").checked+"&quality="+document.querySelector("#quality").value+"&local="+document.querySelector("#proxy").checked+document.querySelector("#other").value
  }
  browser.storage.local.set({
    settings: currsettings,
    temp: { deletecookie: true }
  });
  browser.storage.sync.set({
    settings: currsettings,
    temp: { deletecookie: true }
  });
  // browser.storage.sync.set({
  //   temp: { deletecookie: true}
  // });
  if ((document.querySelector("#other").value.indexOf("&") != 0) && (document.querySelector("#other").value != "")) {
    document.getElementById("warning").style["display"] = "";
  } else {
    document.getElementById("warning").style["display"] = "none";
  }
  document.getElementById("saved").style["display"] = "";
  sleep(1500).then(() => {
    document.getElementById("saved").style["display"] = "none";
  })

  
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.getElementById("url").value = result.settings.url || "invidio.us";
    document.querySelector("#url_override").value = result.settings.url_override || "";
    document.getElementById("darkmode").checked = result.settings.darkmode || false;
    document.getElementById("thinmode").checked = result.settings.thinmode || false;
    document.getElementById("quality").value = result.settings.quality || "hd720";
    document.getElementById("proxy").checked = result.settings.proxy || false;
    document.querySelector("#other").value = result.settings.other || "";
    document.querySelector("#usecookie").checked = result.settings.usecookie || false;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("settings");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
