
var twitch_api_request_manager = ( function () {
	var user_login = "amalrikk";
	var client_id = <CLIENT_ID_FROM_TWITCH_DEVELOPER_CONSOLE>;
	var client_secret = <CLIENT_SECRET_FROM_TWITCH_DEVELOPER_CONSOLE>;
	var twitch_oauth_api_response_dictionnary;
	var twitch_stream_api_response_dictionnary;

	function refresh_icon () {
		if (!twitch_stream_api_response_dictionnary || !twitch_stream_api_response_dictionnary["data"]) {
			error_witness("Error in function \"refresh_icon\"\n");
		}
		else {
			if (twitch_stream_api_response_dictionnary["data"].length == 0) {
				chrome.browserAction.setIcon({ path: "img/icon_amalrik_64_red.png" });
			}
			else {
				chrome.browserAction.setIcon({ path: "img/icon_amalrik_64_green.png" });
			}
		}
	}

	function error_witness (error_message) {
		chrome.browserAction.setIcon({ path: "img/icon_amalrik_64_error.png" });
		/*
		** Comment the following blocks for production environnement
		*/
/*
		if (error_message) {
			console.error(error_message);
		}
		if (twitch_oauth_api_response_dictionnary) {
			console.error(JSON.stringify(twitch_oauth_api_response_dictionnary));
		}
		if (twitch_stream_api_response_dictionnary) {
			console.error(JSON.stringify(twitch_stream_api_response_dictionnary));
		}
*/
	}

	function query_twitch_oauth_api (callBack_query_twitch_stream_api, callBack_refresh_icon) {
		var xhr_twitch_oauth_api;

		xhr_twitch_oauth_api = new XMLHttpRequest();
		xhr_twitch_oauth_api.open("POST", "https://id.twitch.tv/oauth2/token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=client_credentials", true);
		xhr_twitch_oauth_api.onload = function () {
			twitch_oauth_api_response_dictionnary = JSON.parse(xhr_twitch_oauth_api.responseText);
			/*
			** Comment the following instruction for production environnement
			*/
			//error_witness("In function \"query_twitch_oauth_api\":\n");
			callBack_query_twitch_stream_api(callBack_refresh_icon);
		};
		xhr_twitch_oauth_api.onerror = function () {
			error_witness("Error in function \"query_twitch_oauth_api\" - 01\n");
		};
		try {
			xhr_twitch_oauth_api.send();
		}
		catch (err) {
			error_witness("Error in function \"query_twitch_oauth_api\" - 02\n" + err);
		}
	}

	function query_twitch_stream_api(callBack_refresh_icon) {
		var xhr_twitch_stream_api;

		if (!twitch_oauth_api_response_dictionnary || !twitch_oauth_api_response_dictionnary["access_token"]) {
			error_witness("Error in function \"query_twitch_stream_api\" - 01\n");
		}
		else {
			xhr_twitch_stream_api = new XMLHttpRequest();
			xhr_twitch_stream_api.open("GET", "https://api.twitch.tv/helix/streams?user_login=" + user_login, true);
			xhr_twitch_stream_api.setRequestHeader("Client-ID", client_id);
			xhr_twitch_stream_api.setRequestHeader("Authorization", "Bearer " + twitch_oauth_api_response_dictionnary["access_token"]);
			xhr_twitch_stream_api.onload = function () {
				twitch_stream_api_response_dictionnary = JSON.parse(xhr_twitch_stream_api.responseText);
				/*
				** Comment the following instruction for production environnement
				*/
				//error_witness("In function \"query_twitch_stream_api\":\n");
				callBack_refresh_icon();
			};
			xhr_twitch_stream_api.onerror = function () {
				error_witness("Error in function \"query_twitch_stream_api\" - 02\n");
			};
			try {
				xhr_twitch_stream_api.send();
			}
			catch (err) {
				error_witness("Error in function \"query_twitch_stream_api\" - 03\n" + err);
			}
		}
	}

	return ({
		exec: function () {
			query_twitch_oauth_api(query_twitch_stream_api, refresh_icon);
		}
	})
} ) ();

twitch_api_request_manager.exec();

window.setInterval(function () {
	twitch_api_request_manager.exec();
}, 30000);
