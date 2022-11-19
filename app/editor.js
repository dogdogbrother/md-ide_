const { BrowserView, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const path = require('path')
const fs = require('fs')
function createEditor(window, _app) {
  window.edit = new BrowserView({
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  window.main.addBrowserView(window.edit)
  window.edit.setBounds({ x: 200, y: 28, width: 600, height: 600 })
  loadUrl(window.edit.webContents, '/pages/edit/index.html')
  window.edit.webContents.openDevTools()
  ipcMain.on('saveDoc', (_e, docInfo) => {
    const { doc, docName } = JSON.parse(docInfo)
    // 通过 docName 找到md文件,重写即可.
    fs.writeFileSync(path.resolve(
      __dirname, 
      '../docs/' + docName + '.md'
    ), doc)
  })
}

module.exports = {
  createEditor
}