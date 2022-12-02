import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/assets/style/reset.css'
import '../../src/assets/style/index.css'
import './index.less'
import { useEffect, useState } from 'react'
import { MdiMinusBoxOutline, MdiCloseBoxOutline, MdiCheckboxBlankOutline, MdiCheckboxMultipleBlankOutline } from '../../src/assets/svg'
const { ipcRenderer } = require('electron')

var isMac = /macintosh|mac os x/i.test(navigator.userAgent)

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)

function App() {
  const [isMaximized, setIsMaximized] = useState(false)
  useEffect(() => {
    // 去获取是否是全面屏 ps:只在Windows上有作用
    ipcRenderer.send('getIsMaximized')
    ipcRenderer.on('isMaximized', (_e, state) => {
      setIsMaximized(state)
    })
  }, [])
  function openSetMenu() {
    ipcRenderer.send('setting')
  }
  function postCode() {
    
  }
  // 操作窗口 缩放、全屏、关闭
  const setWindow = action => () => {
    ipcRenderer.send('setWindow', action)
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
        <MdiMinusBoxOutline onClick={setWindow('minimize')} />
        {
          isMaximized
          ?
          <MdiCheckboxMultipleBlankOutline onClick={setWindow('restore')} />
          :
          <MdiCheckboxBlankOutline onClick={setWindow('maximize')} />
        }
        <MdiCloseBoxOutline onClick={setWindow('close')}/>
      </div>
    }
  </div>
}