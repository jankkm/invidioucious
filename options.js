const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    settings: { 
      url: document.querySelector("#url").value,
      darkmode: document.querySelector("#darkmode").value,
      thinmode: document.querySelector("#thinmode").value,
      quality: document.querySelector("#quality").value,
      proxy: document.querySelector("#proxy").value,
      other: document.querySelector("#other").value
    }
  });
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
    document.querySelector("#url").value = result.settings.url || "invidio.us";
    document.getElementById("darkmode").value = result.settings.darkmode || "Off";
    document.getElementById("thinmode").value = result.settings.thinmode || "Off";
    document.getElementById("quality").value = result.settings.quality || "720p";
    document.getElementById("proxy").value = result.settings.proxy || "Off";
    document.querySelector("#other").value = result.settings.other || "";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.sync.get("settings");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
