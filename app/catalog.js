const { BrowserView, ipcMain, shell, dialog } = require('electron')
const { loadUrl } = require('./util/loadUrl')
const fs = require('fs')
const { setBrowserView } = require('./util/setBrowserView')
const { createMenu } = require('./util/createMenu')
const { inform } = require('./util/notification')
const { getAllDoc } = require('./util/doc')
const { join } = require('path')
const { createFormDialog } = require('./formDialog')

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
    y: 30, 
    width: 240, 
    height: 900,
    useContentSize: true
  })
  catalog.setAutoResize({
    height: true,
    vertical: true
  })
  loadUrl(catalog.webContents, '/pages/catalog/index.html')
  catalog.webContents.openDevTools()
  ipcMain.on('getDocs', () => {
    getDocAndPostMsg(catalog)
  })
  ipcMain.on('getDoc', (_e, docInfo) => {
    const { docName, dirName } = JSON.parse(docInfo)
    const fullPath = md_file + '/docs/' + (dirName ? dirName + '/' : '') + docName + '.md'
    const docContent = fs.readFileSync(fullPath, 'utf8')
    // // 获取到目录点击后的文档内容,发送给编辑窗口
    window.edit.webContents.postMessage('viewDoc', JSON.stringify({
      doc: docContent,
      docName,
      dirName
    }))
  })
  
  ipcMain.on('emptyMenu', (e) => {
    createMenu(e, [
      {
        label: "新建markdown文档",
        click: () => {
          createFormDialog(window, 'addRootDoc')
        }
      },
      {
        label: "新建目录",
        click: () => {
          createFormDialog(window, 'addDir')
        }
      },
      { type: 'separator' },
      {
        label: "打开所在目录",
        click: () => {
          shell.openPath(join(md_file, 'docs'))
        }
      }
    ])
  })
  ipcMain.on('addDoc', (_, docInfo) => {
    // 传进来的格式为 {dirName: '', docName: '', defaultInfo = { dirName: '', docName: '' }}
    // 要创建文件,还要编辑文档
    const { dirName, docName, defaultInfo = {} } = JSON.parse(docInfo)
    // 代表有原始文档,就是编辑
    if (defaultInfo.docName) {
      if (dirName) {
        fs.renameSync(md_file + '/docs/' + dirName + '/' + defaultInfo.docName + '.md', md_file + '/docs/' + dirName + '/' + docName + '.md')
      } else {
        fs.renameSync(md_file + '/docs/' + defaultInfo.docName + '.md', md_file + '/docs/' + docName + '.md')
      }
      inform('文件重命名成功')
      getDocAndPostMsg(catalog)
      window.formDialog.close()
    }
    // if (dirName) {
    //   fs.writeFileSync(md_file + '/docs/' + dirName + '/' + docName + '.md', '# ' + docName)
    // } else {
    //   fs.writeFileSync(md_file + '/docs/' + docName + '.md', '# ' + docName)
    // }
    // inform('创建文档成功')
    // getDocAndPostMsg(catalog)
    // window.formDialog.close()
  })
  ipcMain.on('addDir', (_e, dirName) => {
    fs.mkdirSync(md_file + '/docs/' + dirName)
    inform('创建文件夹成功')
    getDocAndPostMsg(catalog)
    window.formDialog.close()
  })
  ipcMain.on('editDirName', (_e, renameInfo) => {
    const { dirName, preDirName } = JSON.parse(renameInfo)
    fs.renameSync(md_file + '/docs/' + preDirName, md_file + '/docs/' + dirName)
    inform('文件夹重命名成功')
    getDocAndPostMsg(catalog)
    window.formDialog.close()
  })
  
  ipcMain.on('addDirDoc', (_e, info) => {
    const { dirName, docName } = JSON.parse(info)
    fs.writeFileSync(md_file + '/docs/' + dirName + '/' + docName + '.md', '# ' + docName)
    inform('创建文档成功')
    // 创建成功了 获取全新的给渲染分支
    getDocAndPostMsg(catalog)
  })
  ipcMain.on('editDoc', async (e, docInfo) => {
    const { dirName, docName } = JSON.parse(docInfo)
    createMenu(e, [
      {
        label: "编辑此文档",
        click: () => {
          createFormDialog(window, 'editDoc', { dirName, docName })
        }
      },
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
            fs.unlinkSync(md_file + '/docs/' + docName + '.md')
            getDocAndPostMsg(catalog)
            window.edit.webContents.postMessage('isClearView', docName)
            inform('删除文件夹成功')
          }
        }
      },
      {
        label: "打开文件所在目录",
        click: () => {
          shell.openPath(md_file + '/docs')
        }
      }
    ])
  })
  ipcMain.on('createDirMenu', (e, dirName) => {
    // 如果此文件夹下有文件,禁止删除
    const files = fs.readdirSync(md_file + '/docs/' + dirName)
    createMenu(e, [
      {
        label: "删除此文件夹",
        enabled: !files.length,
        click: () => {
          const buttonInteger = dialog.showMessageBoxSync(window.main, {
            message: `要确认删除${dirName}文件夹吗?`,
            detail: '删除就恢复不了哦',
            buttons: ['确认删除', '取消'],
            cancelId: 1
          })
          if (buttonInteger === 0) {
            fs.rmdirSync(md_file + '/docs/' + dirName)
            getDocAndPostMsg(catalog)
            inform('删除文件夹成功')
          }
        }
      },
      {
        label: "文件夹重命名",
        click: () => {
          createFormDialog(window, 'editDir', {
            dirName
          })
        }
      },
      {
        label: "新建markdown文档",
        click:  () => {
          createFormDialog(window, 'addDirDoc', {
            dirName
          })
          // catalog.webContents.postMessage('addDirDoc', dirName)
        }
      }
    ])
  })
  ipcMain.on('createDirDocMenu', (e, info) => {
    const {dirName, docName} = JSON.parse(info)
    createMenu(e, [
      {
        label: "删除此文档",
        click: () => {
          const buttonInteger = dialog.showMessageBoxSync(window.main, {
            message: `要确认删除${dirName}文档吗?`,
            detail: '删除就恢复不了哦',
            buttons: ['确认删除', '取消'],
            cancelId: 1
          })
          if (buttonInteger === 0) {
            fs.unlinkSync(md_file + '/docs/' + dirName + '/' + docName + '.md')
            getDocAndPostMsg(catalog)
            inform('删除文档成功')
          }
        }
      },
      {
        label: "打开文件所在目录",
        click: () => {
          shell.openPath(md_file + '/docs/' + dirName)
        }
      }
    ])
  })
  ipcMain.on('delDoc', e => {

  })
}

function getDocAndPostMsg(window) {
  window.webContents.postMessage('viewDocs', JSON.stringify(getAllDoc()))
}

module.exports = {
  createCatalog
}
