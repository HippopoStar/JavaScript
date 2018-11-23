# JavaScript
Le dépôt des projets JavaScript !


Pour obtenir le `user_id` d'un utilisateur Twitch : `curl -H 'Client-ID: <votre identifiant client>' -X GET 'https://api.twitch.tv/helix/users?login=<nom de l'utilisateur>'`


```
https://api.twitch.tv/helix/streams?user_login=<nom de l'utilisateur>
```


References:
- https://dev.twitch.tv/docs/api/
- https://dev.twitch.tv/docs/api/reference/#get-streams
- https://dev.twitch.tv/docs/api/reference/#get-users
- https://dev.twitch.tv/docs/api/webhooks-reference/#topic-stream-changed
