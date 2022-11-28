import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class CatalogStore {
  menus = []
  currentMenuName = null  // 应该从本地缓存拿
  addDocState = false  // 新建文件时的输入框开关
  currentDirName = null
  addDirState = false
  constructor() {
    makeAutoObservable(this)
    // 因为监听的执行有可能慢于主进程,所以要去主动拉一次
    ipcRenderer.send('getDocs')
    ipcRenderer.on('viewDocs', (_event, menus) => {
      this.setMenus(JSON.parse(menus))
    })
    // 点击了右键菜单上的 新建文档
    ipcRenderer.on('addDoc', () => {
      this.setAddDocState(true)
    })
    // 点击了右键菜单上的 新建文件夹
    ipcRenderer.on('addDir', () => {
      this.setAddDirState(true)
    })
  }
  setMenus(menus) {
    this.menus = menus
  }
  async setCurrentMenuName(docName, dirName) {
    this.currentMenuName = docName
    this.currentDirName = dirName || null
    ipcRenderer.send('getDoc', JSON.stringify({ docName, dirName }))
  }
  // 带上 docName 是创建,没带上是显示菜单  (有问题 再改)
  addDoc(docName = '') {
    ipcRenderer.send('addDoc', docName)
  }
  addDir(dirName = '') {
    ipcRenderer.send('addDir', dirName)
  }
  eidtDoc(docName) {
    // 暂时只提供删除,后续有重命名
    ipcRenderer.send('eidtDoc', docName)
  }
  setAddDocState(state) {
    this.addDocState = state
  }
  setAddDirState(state) {
    this.addDirState = state
  }
}
export default new CatalogStore()