const { BrowserView } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

function createEditor(window, _app) {
  window.edit = new BrowserView()
  window.main.setBrowserView(window.edit)
  window.edit.setBounds({ x: 0, y: 28, width: 500, height: 300 })
  if (isDev) {
    window.edit.webContents.loadURL('http://localhost:5500/pages/edit/index.html')
  } else {
    window.edit.webContents.loadURL('file://' + path.resolve(__dirname, '../_dist/pages/edit/index.html'))
  }
}

module.exports = {
  createEditor
}