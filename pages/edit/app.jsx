import { useRef, useEffect } from 'react'
import './prism.css'
import './prism.js'

import docStore from '@/store/doc'
import { observer } from 'mobx-react-lite'
import { Empty } from '../../src/assets/svg'
import './index.less'

function App() {
  const textareaRef = useRef(null)
  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault()
      if (docStore.docName) {
        docStore.createEditMenu()
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
  }, [])
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = docStore.doc
    }
  }, [docStore.doc])
  // 插入内容有值时,插入
  useEffect(() => {
    if (!docStore.insertValue) return
    const value = textareaRef.current.value || ''
    // 有 --- 代表是插入头部
    if (docStore.insertValue.includes('---')) {
      const res = docStore.insertValue + '\n' + value
      textareaRef.current.value = res
      docStore.setDoc(res)
    } else {
      const start = textareaRef.current.selectionStart || 0
      textareaRef.current.value = value.substring(0, start) + docStore.insertValue + value.substring(start)
      docStore.setDoc(textareaRef.current.value)
    }
    docStore.setInsertValue('')
  }, [docStore.insertValue])
  useEffect(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart || 0
      const value = textareaRef.current.value || ''
      const insetRes = value.substring(0, start) + `![插图](${docStore.imgPath})` + value.substring(start)
      textareaRef.current.value = insetRes
      docStore.setDoc(insetRes)
    }
  }, [docStore.imgPath])
  function onInput(e) {
    docStore.setDoc(e.target.value)
  }
  function onEnterKey(e) {
    // ctrl + s 保存当前
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) {
      docStore.saveDoc()  
      return e.preventDefault()
    }
    const pointStart = e.target.selectionStart
    const pointEnd = e.target.selectionEnd
    const textLength = e.target.value.length
    const content = e.target.value
    if (e.key === 'Tab') {
      if (textLength === pointStart) {
        const newContent = content + ''
        docStore.setDoc(newContent)
        textareaRef.current.value = newContent
        return e.preventDefault()
      } else {
        const newContent = content.slice(0, pointStart) + '  ' + content.slice(pointEnd)
        textareaRef.current.value = newContent
        e.target.setSelectionRange(pointStart + 2, pointStart + 2)
        docStore.setDoc(newContent)
        return e.preventDefault()
      }
    }
  }
  return (
    <div className='edit-wrap no-scrollbar'>
      {
        docStore.docName
        ?
        <div className='paper '>
          <textarea 
            onInput={onInput} 
            onKeyDown={onEnterKey}
            ref={textareaRef}
            autoFocus
            spellCheck="false" 
            className="no-scrollbar"
          ></textarea>
          <code 
            className='language-markdown'
            dangerouslySetInnerHTML={{ __html: Prism.highlight(docStore.doc || '', Prism.languages.markdown, 'markdown') + '<br />'}}
          ></code>
        </div>
        :
        <div className='empty-wrap'>
          <div>
            <Empty />
            <p>可以右键插入代码片段/预览文章哦</p>
          </div>
        </div>
      }
      
    </div>
  )
}

export default observer(App)