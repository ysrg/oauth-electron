const { app, BrowserWindow, ipcMain } = require("electron");
const { OUTLOOK_AUTH_URL, OUTLOOK_CLIENT_ID, OUTLOOK_REDIRECT_URI, OUTLOOK_TOKEN_URL, OUTLOOK_SCOPE, OUTLOOK_MSG_API, OUTLOOK_HOST_API } = require('./constants');
const fetch = require("node-fetch");

const wnd = require('electron').BrowserWindow;

module.exports = class OutlookProvider {
	constructor() {
		let generatedUrl = new URL(OUTLOOK_AUTH_URL);
    generatedUrl.searchParams.append('client_id', OUTLOOK_CLIENT_ID)
    generatedUrl.searchParams.append('scope', OUTLOOK_SCOPE)
    generatedUrl.searchParams.append('response_type', 'code')
    generatedUrl.searchParams.append('redirect_uri', OUTLOOK_REDIRECT_URI)
		this.authUrl = generatedUrl;
	}

	requestOutlookToken = (code) => {
	  fetch(OUTLOOK_TOKEN_URL, {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
	      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	    },
	    body: new URLSearchParams({
	      code,
	      client_id: OUTLOOK_CLIENT_ID,
	      'grant_type': 'authorization_code',
	    }),
	  }).then(function(response) {
	    return response.json();
	  }).then(function(data) {
	    wnd.getFocusedWindow().webContents.send('login', { data: data.access_token, endpoint: OUTLOOK_MSG_API, host: OUTLOOK_HOST_API });
		  // fetch(OUTLOOK_TOKEN_URL, {
	  	//   method: 'POST',
		  //   headers: {
		  //     'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
		  //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		  //   },
		  //   body: new URLSearchParams({
		  //     code,
		  //     client_id: OUTLOOK_CLIENT_ID,
		  //     'grant_type': 'refresh_token',
		  //   }),
		  //   }).then(function(response) {
	   //  		return response.json();
	  	// 	}).then(function (response) {
		  //     if (response && response.ok) {
		  //     // Success - Received Token.
		  //     // Store it in localStorage maybe?
		  //     window.localStorage.setItem('outlookToken', response.body.access_token);
		  //     } else {
		  //     // Error - Show messages.
		  //     console.log(err);
		  //     }
		  //   });
  })
}

 	handleCallback = (url) => {
	  const raw_code = /code=.*?(&|$)/.exec(url) || null;
	  const code = raw_code && raw_code.length > 1 ? raw_code[0].slice(5) : null;
	  const error = /\?error=(.+)\$/.exec(url);

	  if (code || error) {
	    // Close the browser if code found or error
	    wnd.getFocusedWindow().destroy();
	  }

	  // If there is a code, proceed to get token from github
	  if (code) {
	    this.requestOutlookToken(code);
	  } else if (error) {
	    console.log(
	      "Something went wrong.Please try again."
	    );
	  }
}
}

