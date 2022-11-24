const { Menu, BrowserWindow, MenuItem} = require('electron')
/**
 * @description 创建菜单
 * @param {*} e ipc的event 
 * @param {Array} menus 菜单数组 
 */
function createMenu(e, menus) {
  const menu = new Menu()
  menus.forEach(_menu => menu.append(new MenuItem(_menu)))
  menu.popup(BrowserWindow.fromWebContents(e.sender))
}

module.exports = {
  createMenu
}