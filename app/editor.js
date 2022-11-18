const { BrowserView } = require('electron')
const { loadUrl } = require('./util/loadUrl')

function createEditor(window, _app) {
  window.edit = new BrowserView()
  window.main.addBrowserView(window.edit)
  window.edit.setBounds({ x: 200, y: 28, width: 600, height: 600 })
  loadUrl(window.edit.webContents, '/pages/edit/index.html')
}

module.exports = {
  createEditor
}