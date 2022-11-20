import { useRef, useEffect } from 'react'
import Prism from 'prismjs'
import docStore from '@/store/doc'
import { observer } from 'mobx-react-lite'
import './index.css'

function App() {
  const textareaRef = useRef(null)
  const codeRef = useRef(null)
  useEffect(() => {
    if (codeRef && codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [docStore.doc])
  // 开始定时器,每10s把内容回传给主进程
  function onInput(e) {
    docStore.setDoc(e.target.value)
  }
  function onEnterKey(e) {
    const pointStart = e.target.selectionStart
    const pointEnd = e.target.selectionEnd
    const textLength = e.target.value.length
    const content = e.target.value
    if (e.key === 'Tab') {
      if (textLength === pointStart) {
        const newContent = content + '  '
        docStore.setDoc(newContent)
        textareaRef.current.value = newContent
        return e.preventDefault()
      } else {
        const newContent = content.slice(0, pointStart) + '  ' + content.slice(pointEnd)
        e.target.setSelectionRange(pointStart + 2, pointStart + 2)
        textareaRef.current.value = newContent
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