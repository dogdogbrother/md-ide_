const { BrowserWindow, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')

function createPreview(docName, md_file) {
  const window = new BrowserWindow({
    width: 1180,
    height: 900,
    show: false,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  loadUrl(window, '/pages/preview/index.html')
  window.once('ready-to-show', () => {
    window.show()
    // 这里有重命名的情况 暂时不考虑
    fs.watch(md_file + '/' + docName + '.md', (eventType, filename) => {
      if (eventType === 'rename') {
        return
      }
      const doc = fs.readFileSync(md_file + '/' + filename, 'utf-8')
      window.webContents.postMessage('viewDocText', doc)
    })
    window.webContents.openDevTools()
  })
}

module.exports = {
  createPreview
}
