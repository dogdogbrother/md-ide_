
const { BrowserWindow, ipcMain } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const { getAllDoc } = require('./util/doc')
// 创建个弹出层,用于输入一些信息,例如编辑文件名称,调整层级等等
function createFormDialog(window, action, info = {}) {
  /**
   * @description action 有 (新建根文件 addRootDoc 高度180) (新建文件夹 addDir 150) (文件夹下新建文档 addDirDoc 180) 
   *              (编辑文件夹名称 editDir 125) (编辑文件名称 eidtDoc 150) 
   */
  const actionHeight = {
    'addRootDoc': 180,
    'addDir': 125,
    'addDirDoc': 180,
    'editDir': 125,
    'eidtDoc': 150
  }
  window.formDialog = new BrowserWindow({
    parent: window.main,
    modal: true,
    width: 360,
    height: actionHeight[action],
    useContentSize: true,
    frame: false,
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
    const actionInfo = {
      action,
      ...info
    }
    window.formDialog.webContents.postMessage('getAction', JSON.stringify(actionInfo))
  })
  
}

module.exports = {
  createFormDialog
}