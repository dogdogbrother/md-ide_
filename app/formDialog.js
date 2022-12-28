
const { BrowserWindow, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const { getAllDoc } = require('./util/doc')
// 创建个弹出层,用于输入一些信息,例如编辑文件名称,调整层级等等
function createFormDialog(window,  action) {
  // action 有 (新建根文件 addRootDoc 高度180) (新建文件夹 addDir 150)
  const actionHeight = {
    'addRootDoc': 180,
    'addDir': 150
  }
  window.formDialog = new BrowserWindow({
    parent: window.main,
    modal: true,
    width: 360,
    height: actionHeight[action],
    useContentSize: true,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  loadUrl(window.formDialog, '/pages/formDialog/index.html')
  window.formDialog.webContents.openDevTools()
  ipcMain.on('formDialogClose', () => {
    window.formDialog.close()
  })
  ipcMain.on('getAllDoc', () => {
    window.formDialog.webContents.postMessage('getAllDoc', JSON.stringify(getAllDoc()))
  })
  ipcMain.on('getAction', () => {
    window.formDialog.webContents.postMessage('getAction', action)
  })
  
}

module.exports = {
  createFormDialog
}