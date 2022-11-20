const { app, BrowserWindow } = require('electron')
const { createEditor } = require('./editor')
const { loadUrl } = require('./util/loadUrl')
const { createCatalog } = require('./catalog')
const fs = require('fs')

const windows = {}
app.on('ready', async () => {
  const userDataPath = app.getPath('userData') + '/config.json'
  const isConfigExists = await fs.existsSync(userDataPath)
  // 如果没有配置文件,就让用户选择
  if (isConfigExists) {
    const configPath = await fs.readFileSync(userDataPath)
    const md_file = JSON.parse(configPath).md_file
    createMainWindow(windows, md_file)
  } else {
    const { createProject } = require('./createProject')
    createProject(app, userDataPath, windows)
  }
})

function createMainWindow(windows, md_file) {
  windows.main = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
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
  })
}
module.exports = {
  createMainWindow
}