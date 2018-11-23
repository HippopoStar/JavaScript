checkStream();

setInterval(function(){
	checkStream();
}, 30000);

function checkStream(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.twitch.tv/kraken/streams?user_id=97552678", true);
	xhr.setRequestHeader("Client-ID: [...]");
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			var data = JSON.parse(xhr.responseText);
			if (data["data"] == []){
				chrome.browserAction.setIcon({path: "img/icon_red.png"})
			}else{
				chrome.browserAction.setIcon({path: "img/icon_green.png"})
			}
		}
	}
}
xhr.send();
