const { BrowserView, ipcMain, Menu, MenuItem, BrowserWindow, Notification, shell, dialog } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const { setBrowserView } = require('./util/setBrowserView')
const { createMenu } = require('./util/createMenu')

async function createCatalog(window, md_file) {
  window.catalog = new BrowserView({
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  const { catalog } = window
  setBrowserView(window.main, catalog)
  catalog.setBounds({ 
    x: 0, 
    y: 28, 
    width: 240, 
    height: 900 
  })
  catalog.setAutoResize({
    height: true,
    vertical: true
  })
  loadUrl(catalog.webContents, '/pages/catalog/index.html')
  // catalog.webContents.openDevTools()
  ipcMain.on('getDocs', async () => {
    getDocAndPostMsg(catalog, md_file)
  })
  ipcMain.on('getDoc', async (_e, docName) => {
    const docContent = await fs.readFileSync(md_file + '/' + docName + '.md', 'utf8')
    // 获取到目录点击后的文档内容,发送给编辑窗口
    window.edit.webContents.postMessage('viewDoc', JSON.stringify({
      doc: docContent,
      docName
    }))
  })
  ipcMain.on('addDoc', async (e, docName) => {
    if (docName) {
      await fs.writeFileSync(md_file + '/' + docName + '.md', '# ' + docName)
      const notification = new Notification({
        body: '创建文档成功',
        silent: true,
        timeoutType: 'default',
      })
      notification.show()
      // 创建成功了 获取全新的给渲染分支
      getDocAndPostMsg(catalog, md_file)
    } else {
      createMenu(e, [
        {
          label: "新建markdown文档",
          click: () => {
            catalog.webContents.postMessage('addDoc', '')
          }
        },
        {
          label: "打开所在目录",
          click: () => {
            shell.openPath(md_file)
          }
        }
      ])
    }
  })
  ipcMain.on('eidtDoc', async (e, docName) => {
    createMenu(e, [
      {
        label: "删除此文档",
        click:  () => {
          const buttonInteger = dialog.showMessageBoxSync(window.main, {
            message: `要确认删除${docName}文档吗?`,
            detail: '删除就恢复不了哦',
            buttons: ['确认删除', '取消'],
            cancelId: 1
          })
          if (buttonInteger === 0) {
            fs.unlinkSync(md_file + '/' + docName + '.md')
            getDocAndPostMsg(catalog, md_file)
            window.edit.webContents.postMessage('isClearView', docName)
          }
        }
      },
      {
        label: "打开文件所在目录",
        click: () => {
          shell.openPath(md_file)
        }
      }
    ])
  })
  ipcMain.on('delDoc', e => {

  })
}

async function getDocAndPostMsg(window, md_file) {
  const _docs = await fs.readdirSync(md_file)
  const docs = _docs
    .filter(doc => doc.includes('.md'))
    .map(doc => doc.split('.md')[0])
  window.webContents.postMessage('viewDocs', JSON.stringify(docs))
}

module.exports = {
  createCatalog
}
