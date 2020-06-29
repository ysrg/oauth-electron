const { app, BrowserWindow, ipcMain } = require("electron");
function loadAut() {
  var options = {
    client_id: "173fe996-3a74-4d81-928c-7ac9d6f44a",
    client_secret: "your_client_secret",
    scopes: ["Mail.ReadWrite", "offline_access", "Contacts.ReadWrite"], // Scopes limit access for OAuth tokens.
  };

  // Build the OAuth consent page URL
  var authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    "node-integration": false,
  });
  var githubUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?";
  // var authUrl =
  //   githubUrl + 'client_id=' + options.client_id + '&response_type=code' +'&scope=' + options.scopes + '&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient';
  var authUrl = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=173fe996-3a74-4d81-928c-7ac9d6f4994a&scope=Mail.ReadWrite&response_type=code&redirect_uri=https://login.microsoftonline.com/common/oauth2/nativeclient";
  authWindow.webContents.on(
    "did-get-redirect-request",
    function(event, oldUrl, newUrl) {
      // handleCallback(newUrl);
      console.log("=====", oldUrl, newUrl);
    }
  );
  authWindow.webContents.on("will-navigate", function(event, url) {
    console.log("=====", url);
    // handleCallback(url);
  });
  authWindow.loadURL(authUrl);
  authWindow.show();
}
function createWindow() {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
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
