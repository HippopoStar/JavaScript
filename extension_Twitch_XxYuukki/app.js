var xhr = new XMLHttpRequest();
xhr.open("GET", "https://api.twitch.tv/helix/streams?user_login=xxyuukki", true);
xhr.setRequestHeader("Client-ID","[...]");
xhr.onreadystatechange = function(){
	if (xhr.readyState == 4){
		var data = JSON.parse(xhr.responseText);
		var elm = document.getElementById("info")
		if (data["data"].length == 0){
			elm.style.color = "red"
			elm.innerHTML = "XxYuukki est actuellement hors ligne"
		}else{
			elm.style.color = "green"
			elm.innerHTML = "XxYuukki est actuellement en ligne !"
		}
	}
}
xhr.send();
