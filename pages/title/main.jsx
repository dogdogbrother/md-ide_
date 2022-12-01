import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/assets/style/reset.css'
import '../../src/assets/style/index.css'
import './index.less'
import { MdiMinusBoxOutline, MdiCloseBoxOutline } from '../../src/assets/svg'
const { ipcRenderer } = require('electron')

var isMac = /macintosh|mac os x/i.test(navigator.userAgent)

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)

function App() {
  function openSetMenu() {
    ipcRenderer.send('setting')
  }
  function postCode() {
    
  }
  return <div className='title-wrap'>
    {
      isMac && <div className='mac-placeholder'> </div>
    }
    <ul className='menu'>
      <li onClick={openSetMenu}>设置</li>
      <li>主题</li>
      <li>搜索</li>
      <li onClick={postCode}>提交</li>
    </ul>
    {
      !isMac && <div className='icon-box'>
        <MdiMinusBoxOutline />
        <MdiCloseBoxOutline />
      </div>
    }
  </div>
}