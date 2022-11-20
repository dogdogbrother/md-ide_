const { BrowserView, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const path = require('path')
const fs = require('fs')
const { setBrowserView } = require('./util/setBrowserView')
function createEditor(window, md_file) {
  window.edit = new BrowserView({
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  setBrowserView(window.main, window.edit)
  window.edit.setBounds({ x: 200, y: 28, width: 600, height: 572 })
  window.edit.setAutoResize({
    width: true,
    height: true,
    vertical: true
  })
  loadUrl(window.edit.webContents, '/pages/edit/index.html')
  // window.edit.webContents.openDevTools()
  
  ipcMain.on('saveDoc', (_e, docInfo) => {
    const { doc, docName } = JSON.parse(docInfo)
    // 通过 docName 找到md文件,重写即可.
    fs.writeFileSync(md_file + '/' + docName + '.md', doc)
  })
}

module.exports = {
  createEditor
}