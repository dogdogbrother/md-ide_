
const { BrowserView } = require('electron')
const { loadUrl } = require('./util/loadUrl')

// 创建个弹出层,用于输入一些信息,例如文件名称,调整层级等等
function createFormDialog(window, height = 160, action) {
  // action 有
  window.formDialog = new BrowserView({
    width: 250,
    height,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  loadUrl(window.formDialog, '/pages/formDialog/index.html')
}

module.exports = {
  createFormDialog
}