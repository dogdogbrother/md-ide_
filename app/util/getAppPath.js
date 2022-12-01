const { app } = require('electron')
const fs = require('fs')

const userDataPath = app.getPath('userData')
const configPath = userDataPath + '/config.json'

// 获取配置信息 如果有就返回JOSN, 没有就返回 null
function getConfig() {
  const isConfigExists = fs.existsSync(configPath)
  if(!isConfigExists) return null
  const configString = fs.readFileSync(configPath)
  return JSON.parse(configString)
}

// 设置配置信息
function setConfig(md_file_path) {
  const json = {
    md_file: md_file_path
  }
  fs.writeFileSync(configPath, JSON.stringify(json))
}

// 退出当前项目,删除配置文件
function clearConfig() {
  fs.unlinkSync(configPath)
}
module.exports = {
  getConfig,
  configPath,
  setConfig,
  clearConfig
}