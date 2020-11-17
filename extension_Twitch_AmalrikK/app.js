
var twitch_api_request_manager = ( function () {
	var user_login = "amalrikk";
	var client_id = <CLIENT_ID_FROM_TWITCH_DEVELOPER_CONSOLE>;
	var client_secret = <CLIENT_SECRET_FROM_TWITCH_DEVELOPER_CONSOLE>;
	var twitch_oauth_api_response_dictionnary;
	var twitch_stream_api_response_dictionnary;
	var twitch_game_api_response_dictionnary;
	var elem_dom_status;
	var elem_dom_status_aux;
	var elem_dom_details;
	var elem_dom_game_icon;
	var elem_dom_game_name;
	var elem_dom_title;

	function load_live_informations () {
		if (!twitch_stream_api_response_dictionnary || !twitch_stream_api_response_dictionnary["data"]) {
			error_witness("Error in function \"load_live_informations\"\n");
		}
		else {
			if (twitch_stream_api_response_dictionnary["data"].length == 0) {
				elem_dom_status.style.color = "red";
				elem_dom_status.innerHTML = "hors ligne";
				elem_dom_details.style.display = "none";
			}
			else {
				elem_dom_status.style.color = "green";
				elem_dom_status.innerHTML = "en ligne";
				elem_dom_details.style.display = "block";
				if (twitch_stream_api_response_dictionnary["data"][0]["game_name"]) {
					elem_dom_game_name.innerHTML = twitch_stream_api_response_dictionnary["data"][0]["game_name"];
				}
				if (twitch_stream_api_response_dictionnary["data"][0]["title"]) {
					elem_dom_title.innerHTML = twitch_stream_api_response_dictionnary["data"][0]["title"];
				}
			}
		}
	}

	function load_game_icon () {
		if (!twitch_game_api_response_dictionnary || !twitch_game_api_response_dictionnary["data"]) {
			error_witness("Error in function \"load_game_icon\"\n");
		}
		else {
			/*
			** Comment the following instruction for production environnement
			*/
			//elem_dom_game_name.innerHTML = twitch_game_api_response_dictionnary["data"][0]["box_art_url"];
			elem_dom_game_icon.src = twitch_game_api_response_dictionnary["data"][0]["box_art_url"].replace("{width}", "104").replace("{height}", "144");
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
		if (twitch_game_api_response_dictionnary) {
			console.error(JSON.stringify(twitch_game_api_response_dictionnary));
		}
*/
	}

	function query_twitch_oauth_api (callBack_query_twitch_stream_api, callBack_load_live_informations, callBack_query_twitch_game_api, callBack_load_game_icon) {
		var xhr_twitch_oauth_api;

		xhr_twitch_oauth_api = new XMLHttpRequest();
		xhr_twitch_oauth_api.open("POST", "https://id.twitch.tv/oauth2/token?client_id=" + client_id + "&client_secret=" + client_secret + "&grant_type=client_credentials", true);
		xhr_twitch_oauth_api.onload = function () {
			twitch_oauth_api_response_dictionnary = JSON.parse(xhr_twitch_oauth_api.responseText);
			/*
			** Comment the following instruction for production environnement
			*/
			//error_witness("In function \"query_twitch_oauth_api\":\n");
			callBack_query_twitch_stream_api(callBack_load_live_informations, callBack_query_twitch_game_api, callBack_load_game_icon);
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

	function query_twitch_stream_api(callBack_load_live_informations, callBack_query_twitch_game_api, callBack_load_game_icon) {
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
				callBack_load_live_informations();
				callBack_query_twitch_game_api(callBack_load_game_icon);
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

	function query_twitch_game_api(callBack_load_game_icon) {
		var xhr_twitch_game_api;

		if (!twitch_oauth_api_response_dictionnary || !twitch_oauth_api_response_dictionnary["access_token"])
		{
			error_witness("Error in function \"query_twitch_game_api\" - 01\n");
		}
		else if (!twitch_stream_api_response_dictionnary || !twitch_stream_api_response_dictionnary["data"]) {
			error_witness("Error in function \"query_twitch_game_api\" - 02\n");
		}
		else if (!twitch_stream_api_response_dictionnary["data"][0] || !twitch_stream_api_response_dictionnary["data"][0]["game_id"]) {
			error_witness("Error in function \"query_twitch_game_api\" - 03\n");
		}
		else {
			xhr_twitch_game_api = new XMLHttpRequest();
			xhr_twitch_game_api.open("GET", "https://api.twitch.tv/helix/games?id=" + twitch_stream_api_response_dictionnary["data"][0]["game_id"], true);
			xhr_twitch_game_api.setRequestHeader("Client-ID", client_id);
			xhr_twitch_game_api.setRequestHeader("Authorization", "Bearer " + twitch_oauth_api_response_dictionnary["access_token"]);
			xhr_twitch_game_api.onload = function () {
				twitch_game_api_response_dictionnary = JSON.parse(xhr_twitch_game_api.responseText);
				/*
				** Comment the following instruction for production environnement
				*/
				//error_witness("In function \"query_twitch_game_api\":\n");
				callBack_load_game_icon();
			};
			xhr_twitch_game_api.onerror = function () {
				error_witness("Error in function \"query_twitch_game_api\" - 04\n");
			};
			try {
				xhr_twitch_game_api.send();
			}
			catch (err) {
				error_witness("Error in function \"query_twitch_game_api\" - 05\n" + err);
			}
		}
	}

	return ({
		init: function () {
			elem_dom_status = document.getElementById("status");
			elem_dom_details = document.getElementById("details");
			elem_dom_game_icon = document.getElementById("game_icon");
			elem_dom_game_name = document.getElementById("game_name");
			elem_dom_title = document.getElementById("title");
		},
		exec: function () {
			query_twitch_oauth_api(query_twitch_stream_api, load_live_informations, query_twitch_game_api, load_game_icon);
		}
	})
} ) ();

twitch_api_request_manager.init();
twitch_api_request_manager.exec();
