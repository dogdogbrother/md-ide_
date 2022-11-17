const {app, BrowserWindow } = require('electron')
const path = require('path')
app.on('ready', async () => {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: { 
      nodeIntegration: true,
    },
  })
  win.loadURL(`file://${path.resolve(__dirname, './_dist/index.html')}`)
})
