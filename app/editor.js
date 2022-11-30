const { BrowserView, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const { setBrowserView } = require('./util/setBrowserView')
const { createMenu } = require('./util/createMenu')
const { createPreview } = require('./preview')

function createEditor(window, md_file) {
  window.edit = new BrowserView({
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  const { edit } = window
  setBrowserView(window.main, edit)
  edit.setBounds({ x: 240, y: 30, width: 1040, height: 900 })
  edit.setAutoResize({
    width: true,
    height: true,
    vertical: true,
    useContentSize: true
  })
  loadUrl(edit.webContents, '/pages/edit/index.html')
  // window.edit.webContents.openDevTools()
  
  ipcMain.on('saveDoc', (_e, docInfo) => {
    const { doc, docName } = JSON.parse(docInfo)
    // 通过 docName 找到md文件,重写即可.
    fs.writeFileSync(md_file + '/' + docName + '.md', doc)
  })
  // 在编辑器右键创建菜单
  ipcMain.on('createEditMenu', (e, info ) => {
    const { docName, dirName } = JSON.parse(info)
    createMenu(e, [
      {
        label: '插入头部描述',
        click() {
          edit.webContents.postMessage('insert', 'mate')
        }
      },
      {
        label: '插入js代码',
        click() {
          edit.webContents.postMessage('insert', 'js')
        }
      },
      {
        label: '插入css代码',
        click() {
          edit.webContents.postMessage('insert', 'css')
        }
      },
      { type: 'separator' },
      {
        label: '预览MarkDown',
        click() {
          createPreview(window, docName, md_file, dirName)
        }
      },
    ])
  })
  
}

module.exports = {
  createEditor
}