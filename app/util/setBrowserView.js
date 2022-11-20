/**
 * @description 根据窗口是否挂载了BrowserView 决定是set 还是add
 * @param {*} mainWindow 父窗口
 * @param {*} subWindow 子窗口view
 */
function setBrowserView(mainWindow, subWindow) {
  if (mainWindow.getBrowserView()) {
    mainWindow.addBrowserView(subWindow)
  } else {
    mainWindow.setBrowserView(subWindow)
  }
}

module.exports = {
  setBrowserView
}