const { dialog, BrowserWindow } = require('electron')
const fs = require('fs')
const { createMainWindow } = require('./main.js')
const { configPath, setConfig } = require('./util/getAppPath')
/**
 * @description 创建选择项目目录的弹窗
 */
 async function createProject(app, windows) {
  const window = new BrowserWindow({
    width: 50,
    height: 50,
    opacity: 0
  })
  showChoice(window, app, windows)
}
async function showChoice(window, app, windows) {
  const buttonInteger =  await dialog.showMessageBoxSync(window, {
    message: '还没有设置文档目录哦',
    detail: '选择next-blog项目吧(没有就去下载)',
    buttons: ['打开', '取消'],
    cancelId: 1,
  })
  if (buttonInteger === 0) {
    dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    }).then(async res => {
      const { canceled, filePaths } = res
      // 点了取消 就返回之前的选择框
      if (canceled) {
        showChoice(window, app, windows) 
      } else {
        // 选择了文件夹,就要把文件目录path写入config.js中
        setConfig(filePaths[0])
        createMainWindow(windows, filePaths[0])
      }
    })
  }
  // if (buttonInteger === 1) {
  //   const _userData = app.getPath('userData')
  //   const json = {
  //     md_file: _userData + '/docs'
  //   }
  //   await fs.writeFileSync(configPath, JSON.stringify(json))
  //   await fs.mkdirSync(json.md_file)
  //   await fs.writeFileSync(json.md_file + '/第一个文档.md', '# 第一个文档')
  //   createMainWindow(windows, json.md_file)
  // }
  if (buttonInteger === 1) {
    window.close()
    app.exit()
  }
}

module.exports = {
  createProject
}