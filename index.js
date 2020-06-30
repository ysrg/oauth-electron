const { app, BrowserWindow, ipcMain } = require("electron");
const fetch = require("node-fetch");

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
  console.log('---oo', formBody)
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
  console.log('=====', code)

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

function loadAut() {
  
  // Build the OAuth consent page URL
  authWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    "node-integration": false,
  });
  var githubUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
  // var authUrl =
  //   githubUrl + 'client_id=' + options.client_id + '&response_type=code' +'&scope=' + options.scopes + '&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient';
  var authUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=173fe996-3a74-4d81-928c-7ac9d6f4994a&scope=Mail.ReadWrite&response_type=code&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient";
  // authWindow.webContents.on(
  //   "did-get-redirect-request",
  //   function(event, oldUrl, newUrl) {
  //     // handleCallback(newUrl);
  //     console.log("=====", oldUrl, newUrl);
  //   }
  // );
  authWindow.once('did-finish-load', () => {
    console.log('wwwwwww')
    // Send Message
 })
  authWindow.webContents.on("did-navigate", function(event, url) {
    // console.log("==will-navigate===", url);
    handleCallback(url);
    // handleCallback(url);
  });
  authWindow.loadURL(authUrl);
  authWindow.show();
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

  // and load the index.html of the app.
  win.loadFile("index.html");
  ipcMain.on('submit', e => {
    // win.loadURL('about:blank');
    loadAut();
  });
  // authWindow.loadURL(authUrl);
  // authWindow.show();
  // 'will-navigate' is an event emitted when the window.location changes
  // newUrl should contain the tokens you need
  win.webContents.on("will-navigate", function(event, newUrl) {
    console.log(newUrl);
    // More complex code to handle tokens goes here
  });

  // win.on('closed', function() {
  //     authWindow = null;
  // });
}

app.whenReady().then(createWindow);
