const { dialog, BrowserWindow } = require('electron')
const fs = require('fs')
const { createMainWindow } = require('./main.js')
/**
 * @description 创建选择项目目录的弹窗
 */
 async function createProject(app, userDataPath, windows) {
  const window = new BrowserWindow({
    width: 50,
    height: 50,
    opacity: 0
  })
  showChoice(window, app, userDataPath, windows)
}
async function showChoice(window, app, userDataPath, windows) {
  const buttonInteger =  await dialog.showMessageBoxSync(window, {
    message: '还没有设置文件夹哦',
    detail: '请选择markDown文件的目录吧',
    buttons: ['打开已有项目', '创建新的', '取消'],
    cancelId: 2
  })
  if (buttonInteger === 0) {
    dialog.showOpenDialog(window, {
      properties: ['openDirectory']
    }).then(async res => {
      const { canceled, filePaths } = res
      // 点了取消 就返回之前的选择框
      if (canceled) {
        showChoice(window, app, userDataPath, windows) 
      } else {
        const json = {
          md_file: filePaths[0]
        }
        await fs.writeFileSync(userDataPath, JSON.stringify(json))
        // 选择了文件夹,就要把文件目录path写入config.js中
        createMainWindow(windows, json.md_file)
      }
    })
  }
  if (buttonInteger === 1) {
    const _userData = app.getPath('userData')
    const json = {
      md_file: _userData + '/docs'
    }
    await fs.writeFileSync(userDataPath, JSON.stringify(json))
    console.log(json.md_file + '/第一个文档.md');
    await fs.mkdirSync(json.md_file)
    await fs.writeFileSync(json.md_file + '/第一个文档.md', '# 第一个文档')
    createMainWindow(windows, json.md_file)
  }
  if (buttonInteger === 2) {
    window.close()
    app.exit()
  }
}

module.exports = {
  createProject
}