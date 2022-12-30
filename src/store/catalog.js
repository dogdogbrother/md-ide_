import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class CatalogStore {
  menus = []
  currentMenuName = null  // 应该从本地缓存拿
  currentDirName = null
  constructor() {
    makeAutoObservable(this)
    // 因为监听的执行有可能慢于主进程,所以要去主动拉一次
    ipcRenderer.send('getDocs')
    ipcRenderer.on('viewDocs', (_event, menus) => {
      this.setMenus(JSON.parse(menus))
    })
  }
  setMenus(menus) {
    this.menus = menus
  }
  setCurrentMenuName(docName, dirName) {
    this.currentMenuName = docName
    this.currentDirName = dirName || null
    ipcRenderer.send('getDoc', JSON.stringify({ docName, dirName }))
  }
  // 双击空白处创建菜单
  emptyMenu() {
    ipcRenderer.send('emptyMenu')
  }
  // 带上 docName 是创建,没带上是显示菜单  (有问题 再改)
  addDoc(docName = '') {
    ipcRenderer.send('addDoc', docName)
  }
  addDir(dirName = '') {
    ipcRenderer.send('addDir', dirName)
  }
  // 增加文件夹下的文档
  addDirDoc(dirName = '', docName = '') {
    ipcRenderer.send('addDirDoc', JSON.stringify({dirName, docName}))
  }
  editDoc(docInfo) {
    console.log(docInfo);
    ipcRenderer.send('editDoc', docInfo)
  }
  setAddDocState(state) {
    this.addDocState = state
  }
  createDirMenu(dirName) {
    ipcRenderer.send('createDirMenu', dirName)
  }
  createDirDocMenu(dirName = '', docName = '') {
    ipcRenderer.send('createDirDocMenu', JSON.stringify({dirName, docName}))
  }
}
export default new CatalogStore()