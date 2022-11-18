import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class CatalogStore {
  menus = []
  currentMenuName = null  // 应该从本地缓存拿
  constructor() {
    makeAutoObservable(this)
    ipcRenderer.send('getDocs')
    // 因为监听的执行有可能慢于主进程,所以要去主动拉一次
    ipcRenderer.on('viewDocs', (_event, menus) => {
      this.setMenus(JSON.parse(menus))
    })
  }
  setMenus(menus) {
    this.menus = menus
  }
  async setCurrentMenuName(menuName) {
    this.currentMenuName = menuName
    ipcRenderer.send('getDoc', menuName)
  }
}
export default new CatalogStore()