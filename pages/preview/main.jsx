import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/assets/style/index.css'
import './index.less'
import './md-style.less'
import { useState, useEffect } from 'react'
import matter from 'gray-matter'
import MarkDown from 'markdown-to-jsx'
const { ipcRenderer } = require('electron')
import Prism from 'prismjs'

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)
function App() {
  const [content, setContent] = useState('')
  const [appPath, setAppPath] = useState('')
  useEffect(() => {
    ipcRenderer.on('viewDocText', (_event, text) => {
      const { content } = matter(text)
      setContent(content)
    })
    // 要去获取到本机的绝对路径
    ipcRenderer.send('getAppPath')
    ipcRenderer.on('appPath', (_e, text) => {
      setAppPath(text)
    })
    
  }, [])
  function Code({className, children}) {
    if (className) {
      const newLanguage = className.replace("lang-", "language-");
      const type = newLanguage.split('language-')[1]
      return <code 
        className={className}
        dangerouslySetInnerHTML={{
          __html: Prism.highlight(children, Prism.languages[type], type)
        }}
      ></code>
    }
    return <code>{children}</code>
  }
  return <div className='paper'>
    <MarkDown
      //把 ](/img/ 替换成本机文本的绝对路径
      children={content.replace(/]\(\/img\//g, `](file://${appPath}/docs/img/`)}
      options={{ 
        forceBlock: true, 
        wrapper: 'article',
        overrides: {
          code: {
            component: Code
          }
        }
      }}
    ></MarkDown>
  </div>
}

// 获取加强版md 增加 :::tip  内容 ::: 
function getStrongMd() {

}

