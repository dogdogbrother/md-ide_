const { BrowserWindow, screen } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const wathch = {
  fs: null
}
function createPreview(window, docName, md_file) {
  if (window.preview) {
    window.preview.setTitle(docName)
    wathch.fs.close()
    watchFs()
    window.preview.setFocusable(true)
    window.preview.setAlwaysOnTop(true)
    setTimeout(() => {
      window.preview.setAlwaysOnTop(false)
    }, 500)
  } else {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    window.preview = new BrowserWindow({
      width: 1180,
      height,
      show: false,
      y: 0,
      x: width - 1180,
      title: docName,
      webPreferences: { 
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        allowRunningInsecureContent: true
      },
    })
    const currentWindow = window.preview
    loadUrl(currentWindow, '/pages/preview/index.html')
    currentWindow.once('ready-to-show', () => {
      currentWindow.show()
      watchFs()
      // currentWindow.webContents.openDevTools()
    })
  }
  window.preview.on('close', () => {
    wathch.fs.close()
    window.preview = null
  })
  function watchFs() {
    // 这里有重命名的情况 暂时不考虑
    wathch.fs = fs.watch(md_file + '/' + docName + '.md', (eventType, filename) => {
      if (eventType === 'rename') {
        return
      }
      const doc = fs.readFileSync(md_file + '/' + filename, 'utf-8')
      window.preview.webContents.postMessage('viewDocText', doc)
    })
    const doc = fs.readFileSync(md_file + '/' + docName + '.md', 'utf-8')
    window.preview.webContents.postMessage('viewDocText', doc)
  }
}

module.exports = {
  createPreview
}
