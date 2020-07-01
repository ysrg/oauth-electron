const path = require('path');
const { OUTLOOK_AUTH_URL } = require('./constants');
const { app, BrowserWindow, ipcMain } = require("electron");

class MainProviderManager {
  constructor() {
    this.authUrl = null
    this.authWindow = null
    this.handleCallback = null
  }

  openAuthWindow() {
    this.authWindow = new BrowserWindow({
      width: 1200,
      height: 900,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    this.authWindow.webContents.on("did-navigate", (event, url) => {
      this.handleCallback(url);
    });
    this.authWindow.loadURL(this.authUrl.href);
    this.authWindow.show();
  }

  assign = (obj) => {
    for (let i in obj) {
      let field = obj[i];
      if (typeof field === 'function') {
        field = field.bind(this);
      }
      this[i] = field;
    }
  }

}

exports.MainProviderManager = MainProviderManager;
exports.ProviderManager = new MainProviderManager();

// export * from './googleProvider';
// export * from './yahooProvider';
exports.OutlookProvider = require('./OutlookProvider');
// export * from './mairuProvider';
