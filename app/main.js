const { app, BrowserWindow } = require('electron')
const { createEditor } = require('./editor')
const { loadUrl } = require('./util/loadUrl')
const { createCatalog } = require('./catalog')
const { createTitle } = require('./title')
const { getConfig } = require('./util/getAppPath')

const windows = {}
app.on('ready', () => {
  const config = getConfig()
  // 如果没有配置文件,就让用户选择
  if (config) {
    createMainWindow(windows, config.md_file)
  } else {
    const { createProject } = require('./createProject')
    createProject(app, windows)
  }
})

function createMainWindow(windows, md_file) {
  windows.main = new BrowserWindow({
    width: 1280,
    height: 930,
    useContentSize: true,
    show: false,
    frame: false,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {
      x: 20,
      y: 6
    },
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
  })
  loadUrl(windows.main)
  windows.main.once('ready-to-show', () => {
    windows.main.show()
    createCatalog(windows, md_file)
    createEditor(windows, md_file)
    createTitle(windows)
  })
  windows.main.on('closed', () => {
    windows.main = null
    // 如果不存在这个文件(退出项目时删除了),就代表此次关闭是 退出当前项目 操作引起的
    if (!getConfig()) {
      const { createProject } = require('./createProject')
      setTimeout(() => {
        createProject(app, windows)
      }, 500)
    }
  })
}
module.exports = {
  createMainWindow
}