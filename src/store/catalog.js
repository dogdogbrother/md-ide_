import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class CatalogStore {
  menus = []
  currentMenuName = null  // 应该从本地缓存拿
  addState = false  // 新建文件时的输入框开关
  constructor() {
    makeAutoObservable(this)
    // 因为监听的执行有可能慢于主进程,所以要去主动拉一次
    ipcRenderer.send('getDocs')
    ipcRenderer.on('viewDocs', (_event, menus) => {
      this.setMenus(JSON.parse(menus))
    })
    // 点击了右键菜单上的 新建文档
    ipcRenderer.on('addDoc', () => {
      this.setAddState(true)
    })
  }
  setMenus(menus) {
    this.menus = menus
  }
  async setCurrentMenuName(menuName) {
    this.currentMenuName = menuName
    ipcRenderer.send('getDoc', menuName)
  }
  // 带上 docName 是创建,没带上是显示菜单  (有问题 再改)
  addDoc(docName = '') {
    ipcRenderer.send('addDoc', docName)
  }
  eidtDoc(docName) {
    // 暂时只提供删除,后续有重命名
    ipcRenderer.send('eidtDoc', docName)
  }
  setAddState(state) {
    this.addState = state
  }
}
export default new CatalogStore()