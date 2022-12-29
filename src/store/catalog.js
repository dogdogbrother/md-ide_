import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class CatalogStore {
  menus = []
  currentMenuName = null  // 应该从本地缓存拿
  addDocState = false  // 新建文件时的输入框开关
  currentDirName = null
  addDirState = false
  isRepeat = false  // 输入的文档或者文件夹名称是否重复
  dirDocState = {}  // 文件夹下的文件输入状态,key 为 dirName
  constructor() {
    makeAutoObservable(this)
    // 因为监听的执行有可能慢于主进程,所以要去主动拉一次
    ipcRenderer.send('getDocs')
    ipcRenderer.on('viewDocs', (_event, menus) => {
      console.log(JSON.parse(menus));
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
    // 
    ipcRenderer.on('addDirDoc', (_event, dirName) => {
      this.setDirDocState(dirName, true)
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
  eidtDoc(docInfo) {
    ipcRenderer.send('eidtDoc', docInfo)
  }
  setAddDocState(state) {
    this.addDocState = state
  }
  setAddDirState(state) {
    this.addDirState = state
  }
  createDirMenu(dirName) {
    ipcRenderer.send('createDirMenu', dirName)
  }
  setIsRepeat(state) {
    this.isRepeat = state
  }
  setDirDocState(dirName, state) {
    this.dirDocState[dirName] = state
  }
  createDirDocMenu(dirName = '', docName = '') {
    ipcRenderer.send('createDirDocMenu', JSON.stringify({dirName, docName}))
  }
}
export default new CatalogStore()