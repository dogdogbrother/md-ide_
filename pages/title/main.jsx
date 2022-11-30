import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/assets/style/reset.css'
import '../../src/assets/style/index.css'
import './index.less'
import { MdiMinusBoxOutline, MdiCloseBoxOutline } from '../../src/assets/svg'

var isMac = /macintosh|mac os x/i.test(navigator.userAgent)

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)

function App() {
  return <div className='title-wrap'>
    {
      isMac && <div className='mac-placeholder'> </div>
    }
    <ul className='menu'>
      <li>设置</li>
      <li>主题</li>
      <li>搜索</li>
    </ul>
    {
      !isMac && <div className='icon-box'>
        <MdiMinusBoxOutline />
        <MdiCloseBoxOutline />
      </div>
    }
  </div>
}