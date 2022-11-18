const { BrowserView, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const path = require('path')

function createCatalog(window, _app) {
  window.catalog = new BrowserView({
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  const { catalog } = window
  window.main.setBrowserView(catalog)
  catalog.setBounds({ 
    x: 0, 
    y: 28, 
    width: 200, 
    height: 600 
  })
  loadUrl(catalog.webContents, '/pages/catalog/index.html')
  catalog.webContents.openDevTools()
  ipcMain.on('getDocs', async () => {
    const _docs = await fs.readdirSync(path.resolve(__dirname, '../docs'))
    const docs = _docs
      .filter(doc => doc.includes('.md'))
      .map(doc => doc.split('.md')[0])
    catalog.webContents.postMessage('viewDocs', JSON.stringify(docs))
  })
  ipcMain.on('getDoc', async (_e, docName) => {
    const docContent = await fs.readFileSync(
      path.resolve(__dirname, '../docs/' + docName + '.md'),
      'utf8'
    )
    // 获取到目录点击后的文档内容,发送给编辑窗口
    window.edit.webContents.postMessage('viewDoc', JSON.stringify({
      doc: docContent,
      docName
    }))
  })
}

module.exports = {
  createCatalog
}