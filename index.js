const { app, BrowserWindow, ipcMain } = require("electron");
const fetch = require("node-fetch");
const { ProviderManager, OutlookProvider, GoogleProvider, YahooProvider, MailRuProvider, YandexProvider } = require('./providers');
let win, authWindow;
var options = {
  // client_id: "173fe996-3a74-4d81-928c-7ac9d6f4994a",
  // client_secret: "your_client_secret",
  scopes: ["Mail.ReadWrite","openId", "profile", "Mail.ReadWrite", "offline_access", "Contacts.ReadWrite"], // Scopes limit access for OAuth tokens.
  redirect_uri: 'https://login.microsoftonline.com/common/oauth2/nativeclient',
};
var postOpts = {
  // client_id: "173fe996-3a74-4d81-928c-7ac9d6f4994a",
  // client_secret: "your_client_secret",
  // scopes: ["Mail.ReadWrite", "offline_access", "Contacts.ReadWrite"], // Scopes limit access for OAuth tokens.
  redirect_uri: 'https://login.microsoftonline.com/common/oauth2/nativeclient',
  grant_type: 'authorization_code'
};

function requestGithubToken(options, code) {
  var oo = {...postOpts, code}

  var formBody = [];
  for (var property in oo) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(oo[property]);
    formBody.push(encodedKey + "=" + encodedValue);
}
  fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    qs: options,
    method: 'POST',
    headers: {
      'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: new URLSearchParams({
      'userName': 'test@gmail.com',
      'password': 'Password!',
      'grant_type': 'authorization_code',
      client_id: "173fe996-3a74-4d81-928c-7ac9d6f4994a",
      code
    }),
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    console.log('res', data)
    win.webContents.send('login', data.access_token);
  })
  // apiRequests
  //   .post('https://github.com/login/oauth/access_token', {
  //     client_id: options.client_id,
  //     client_secret: options.client_secret,
  //     code: code,
  //   })
  //   .end(function (err, response) {
  //     if (response && response.ok) {
  //     // Success - Received Token.
  //     // Store it in localStorage maybe?
  //     window.localStorage.setItem('githubtoken', response.body.access_token);
  //     } else {
  //     // Error - Show messages.
  //     console.log(err);
  //     }
  //   });
}
function handleCallback(url) {
  var raw_code = /code=.*?(&|$)/.exec(url) || null;
  var code = raw_code && raw_code.length > 1 ? raw_code[0].slice(5) : null;
  
  var error = /\?error=(.+)\$/.exec(url);

  if (code || error) {
    // Close the browser if code found or error
    authWindow.destroy();
  }

  // If there is a code, proceed to get token from github
  if (code) {
    requestGithubToken(options, code);
  } else if (error) {
    alert(
      "Oops! Something went wrong and we couldn't" +
        'log you in using Github. Please try again.'
    );
  }
}

function createWindow() {
  // Create the browser window.
   win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.webContents.openDevTools();
  win.loadFile("index.html");
  ipcMain.on('set:provider', (e, provider) => {
    switch(provider) {
      case 'Google':
      ProviderManager.assign(new GoogleProvider());
      break;
      case 'Outlook':
      ProviderManager.assign(new OutlookProvider());
      break;
      default: break;
    }
    ProviderManager.openAuthWindow()
  });
}

app.whenReady().then(createWindow);
