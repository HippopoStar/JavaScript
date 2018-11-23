checkStream();

setInterval(function(){
	checkStream();
}, 30000);

function checkStream(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.twitch.tv/kraken/streams/xxyuukki?client_id=[...]", true);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (data["stream"] == null){
				chrome.browserAction.setIcon({path: "img/icon_red.png"})
			}else{
				chrome.browserAction.setIcon({path: "img/icon_green.png"})
			}
		}
	}
}
xhr.send();
