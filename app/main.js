const {app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { createEditor } = require('./editor')

const windows = {}

app.on('ready', async () => {
  windows.main = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { 
      nodeIntegration: true,
      webSecurity: false
    },
  })
  if (isDev) {
    windows.main.loadURL('http://localhost:5500')
  } else {
    windows.main.loadURL('file://' + path.resolve(__dirname, '../_dist/index.html'))
  }
  setTimeout(() => {
    createEditor(windows, app)

  }, 2000)
})
