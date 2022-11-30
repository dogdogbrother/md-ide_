const { BrowserView } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const { setBrowserView } = require('./util/setBrowserView')

function createTitle(window) {
  window.title = new BrowserView({
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  setBrowserView(window.main, window.title)
  window.title.setAutoResize({
    width: true,
  })
  window.title.setBounds({ x: 0, y: 0, width: 1280, height: 30 })
  window.title.webContents.openDevTools()
  loadUrl(window.title.webContents, '/pages/title/index.html')
}

module.exports = {
  createTitle
}