const {app, BrowserWindow } = require('electron')
const { createEditor } = require('./editor')
const { createCatalog } = require('./catalog')
const { loadUrl } = require('./util/loadUrl')
const windows = {}

app.on('ready', async () => {
  windows.main = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  loadUrl(windows.main)
  windows.main.once('ready-to-show', () => {
    windows.main.show()
    createCatalog(windows, app)
    createEditor(windows, app)
  })
})
