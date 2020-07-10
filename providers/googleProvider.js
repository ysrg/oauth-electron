const { app, BrowserWindow, ipcMain } = require('electron');
const {
  	GOOGLE_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SCOPE,
	GOOGLE_REDIRECT_URI,
	GOOGLE_TOKEN_URL,
	GOOGLE_MSG_API,
	GOOGLE_HOST_API,
	GOOGLE_CLIENT_SECRET
} = require('./constants');
const fetch = require('node-fetch');
const imap = require('./Imap');

const wnd = require('electron').BrowserWindow;

module.exports = class GoogleProvider {
  constructor() {
    const generatedUrl = new URL(GOOGLE_AUTH_URL);
    generatedUrl.searchParams.append('client_id', GOOGLE_CLIENT_ID);
    generatedUrl.searchParams.append('scope', GOOGLE_SCOPE);
    generatedUrl.searchParams.append('response_type', 'code');
    generatedUrl.searchParams.append('redirect_uri', GOOGLE_REDIRECT_URI);
    this.authUrl = generatedUrl;
  }

	requestToken = (code) => {
	  fetch(GOOGLE_TOKEN_URL, {
	    method: 'POST',
	    headers: {
	      Accept: 'application/json, application/xml, text/plain, text/html, *.*',
	      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
	    },
	    body: new URLSearchParams({
	      code: decodeURIComponent(code),
	      scope: GOOGLE_SCOPE,
	      client_id: GOOGLE_CLIENT_ID,
	      client_secret: GOOGLE_CLIENT_SECRET,
	      redirect_uri: GOOGLE_REDIRECT_URI,
	      grant_type: 'authorization_code',
	    }),
	  }).then((response) => response.json()).then((data) => {
	    wnd.getFocusedWindow().webContents.send('login', { token: data.access_token, endpoint: GOOGLE_MSG_API, host: GOOGLE_HOST_API, provider: 'Google' });
		const imp = new imap(data.access_token,null, 'imap.gmail.com', 993)
		imp.connect();
	  });
	}

 	handleCallback = (url) => {
	  const raw_code = /approvalCode=.*?(&|$)/.exec(url) || null;
	  const code = raw_code && raw_code.length > 1 ? raw_code[0].slice(13) : null;
	  const error = /\?error=(.+)\$/.exec(url);

	  if (code || error) {
	    // Close the browser if code found or error
	    wnd.getFocusedWindow().destroy();
	  }

	  // If there is a code, proceed to get token from github
	  if (code) {
	    this.requestToken(code);
	  } else if (error) {
	    console.log(
	      'Something went wrong.Please try again.',
	    );
	  }
 	}
};
