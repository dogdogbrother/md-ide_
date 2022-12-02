const { BrowserView, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const { setBrowserView } = require('./util/setBrowserView')
const { createMenu } = require('./util/createMenu')
const { clearConfig } = require('./util/appPath')

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
  ipcMain.on('setting', e => {
    createMenu(e, [
      {
        label: '退出当前项目',
        click: () => {
          clearConfig()
          window.main.destroy()
        }
      }
    ])
  })
  ipcMain.on('setWindow', (_e, action) => {
    if (action === 'minimize') {
      window.main.minimize()
    }
    if (action === 'maximize') {
      window.title.webContents.postMessage('isMaximized', true)
      window.main.maximize()
    }
    if (action === 'restore') {
      window.title.webContents.postMessage('isMaximized', false)
      window.main.restore()
    }
    if (action === 'close') {
      window.main.close()
    }
  })
  ipcMain.once('getIsMaximized', () => {
    window.title.webContents.postMessage('isMaximized', window.main.isMaximized())
  })
}

module.exports = {
  createTitle
}