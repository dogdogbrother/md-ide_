import React from 'react'
import ReactDOM from 'react-dom/client'
import '../../src/assets/style/reset.css'
import '../../src/assets/style/index.css'
import './index.css'
import { useState, useEffect } from 'react'
import matter from 'gray-matter'
// import html from 'remark-html'
// import prism from 'remark-prism'
// import { remark } from 'remark';
const { ipcRenderer } = require('electron')

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)
function App() {
  const [content, setContent] = useState('')
  useEffect(() => {
    ipcRenderer.on('viewDocText', (_event, text) => {
      console.log(1);
      setContent(123)
    })
  }, [])
  async function formatting(text) {
    const { content } = matter(text)
    // const result = await remark()
    //   .use(html, { sanitize: false })
    //   .use(prism)
    //   .process(content)
    return content.toString();
  }
  return <div className='paper'>
    {content}
  </div>
}
