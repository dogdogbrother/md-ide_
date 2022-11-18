const isDev = require('electron-is-dev')
const path = require('path')

function loadUrl(window, route = '') {
  if (isDev) {
    window.loadURL(`http://localhost:5500${route}`)
  } else {
    window.loadURL(`file://${path.resolve(__dirname, '../../_dist/' + route)}`)
  }
}

module.exports = {
  loadUrl
}