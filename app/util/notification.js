const { Notification } = require('electron')

function inform(msg) {
  const notification = new Notification({
    body: msg,
    silent: true,
    timeoutType: 'default',
  })
  notification.show()
}

module.exports = {
  inform
}