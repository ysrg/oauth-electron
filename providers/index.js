const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { OUTLOOK_AUTH_URL } = require('./constants');

class MainProviderManager {
  constructor() {
    this.authUrl = null;
    this.authWindow = null;
    this.handleCallback = function () {};
  }

  openAuthWindow() {
    this.authWindow = new BrowserWindow({
      width: 1200,
      height: 900,
      webPreferences: {
        nodeIntegration: true,
      },
    });
    this.authWindow.webContents.on('did-navigate', (event, url) => {
      this.handleCallback(url);
    });
    this.authWindow.loadURL(this.authUrl.href);
    this.authWindow.show();
  }

  assign = (obj) => {
    for (const i in obj) {
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

exports.GoogleProvider = require('./GoogleProvider');
exports.OutlookProvider = require('./OutlookProvider');
// exports.OutlookProvider = require('./OutlookProvider');
// exports.OutlookProvider = require('./OutlookProvider');
// exports.OutlookProvider = require('./OutlookProvider');
