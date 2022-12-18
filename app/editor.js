const { BrowserView, ipcMain, dialog } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const { setBrowserView } = require('./util/setBrowserView')
const { createMenu } = require('./util/createMenu')
const { createPreview } = require('./preview')
const { setDocImg } = require('./util/doc')

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
    const { doc, docName, dirName } = JSON.parse(docInfo)
    const resPath = `${md_file}/docs/${dirName ? dirName + '/' : ''}${docName}.md`
    fs.writeFileSync(resPath, doc)
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
      {
        label: '插入图片',
        click() {
          insertImg(window)
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

// 选择图片插入
function insertImg(windows) {
  const imgPath = dialog.showOpenDialogSync(windows.main, {
    properties: ['openFile'],
    filters: [{ name: 'Image', extensions: ['jpg', 'png', 'gif'] }]
  })
  if (imgPath) {
    const resPath = setDocImg(imgPath)
    windows.edit.webContents.postMessage('insertImg', resPath)
  }
}
module.exports = {
  createEditor
}