import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/assets/style/index.css'
import './index.css'
import './md-style.css'
import { useState, useEffect } from 'react'
import matter from 'gray-matter'
import MarkDown from 'markdown-to-jsx'
const { ipcRenderer } = require('electron')

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)
function App() {
  const [content, setContent] = useState('')
  useEffect(() => {
    ipcRenderer.on('viewDocText', (_event, text) => {
      const { content } = matter(text)
      setContent(content)
    })
  }, [])
  return <div className='paper'>
    <MarkDown
      children={content}
      options={{ 
        forceBlock: true, 
        wrapper: 'article',
      }}
    ></MarkDown>
  </div>
}
