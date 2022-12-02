const { BrowserWindow, screen, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const { getConfig } = require('./util/appPath')
const wathch = {
  fs: null
}
function createPreview(window, docName, md_file, dirName) {
  if (window.preview) {
    // 如果有预览窗口了,设置 title
    window.preview.setTitle(docName)
    // 关闭旧的文件观察
    wathch.fs.close()
    // 开启新的文件观察
    watchFs()
    // 把新窗口设置最上级 然后再取消
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
      currentWindow.webContents.openDevTools()
    })
  }
  window.preview.on('close', () => {
    wathch.fs.close()
    window.preview = null
  })
  ipcMain.once('getAppPath', e => {
    const { md_file } = getConfig()
    e.reply('appPath', md_file)
  })
  function watchFs() {
    const fullPath = md_file + '/docs/' + (dirName ? dirName + '/' : '') + docName + '.md'
    // 这里有重命名的情况 暂时不考虑
    wathch.fs = fs.watch(fullPath, (eventType, filename) => {
      if (eventType === 'rename') {
        return
      }
      const doc = fs.readFileSync(fullPath, 'utf-8')
      window.preview.webContents.postMessage('viewDocText', doc)
    })
    const doc = fs.readFileSync(fullPath, 'utf-8')
    window.preview.webContents.postMessage('viewDocText', doc)
  }
}

module.exports = {
  createPreview
}
