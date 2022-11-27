import { useRef, useEffect } from 'react'
import Prism from 'prismjs'
import docStore from '@/store/doc'
import { observer } from 'mobx-react-lite'
import './index.css'

function App() {
  const textareaRef = useRef(null)
  const codeRef = useRef(null)
  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault()
      docStore.createEditMenu()
    }
    window.addEventListener('contextmenu', handleContextMenu)
  }, [])
  useEffect(() => {
    if (codeRef && codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [docStore.doc])
  // 插入内容有值时,插入
  useEffect(() => {
    if (!docStore.insertValue) return
    const value = textareaRef.current.value || ''
    const start = textareaRef.current.selectionStart || 0
    textareaRef.current.value = value.substring(0, start) + docStore.insertValue + value.substring(start)
    docStore.setDoc(textareaRef.current.value)
    docStore.setInsertValue('')
  }, [docStore.insertValue])
  
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
    <>
      <div className='edit-wrap'>
        <pre className='no-scrollbar'>
          <textarea 
            autoFocus
            spellCheck="false"
            className='no-scrollbar'
            value={docStore.doc || undefined}
            ref={textareaRef}
            onInput={onInput}
            onKeyDown={onEnterKey}
          />
          <code ref={codeRef} className="language-markdown line-numbers no-scrollbar">
            {docStore.doc}
          </code>
        </pre>
      </div>
    </>
  )
}

export default observer(App)