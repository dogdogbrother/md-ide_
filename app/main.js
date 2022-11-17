const {app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

app.on('ready', async () => {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: { 
      nodeIntegration: true,
      webSecurity: false
    },
  })
  if (isDev) {
    win.loadURL('http://localhost:5500')
  } else {
    win.loadURL('file://' + path.resolve(__dirname, '../_dist/index.html'))
  }
})
