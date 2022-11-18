import { useState, useRef, useEffect } from 'preact/hooks'
import Prism from 'prismjs'
import './index.css'
export function App() {
  const [content, setContent] = useState('')
  const textareaRef = useRef(null)
  const codeRef = useRef(null)
  useEffect(() => {
    if (codeRef && codeRef.current) {
      // Prism.highlightElement(codeRef.current)
    }
  }, [content])
  function onInput(e) {
    setContent(e.target.value)
  }
  function onEnterKey(e) {
    const pointStart = e.target.selectionStart
    const pointEnd = e.target.selectionEnd
    const textLength = e.target.value.length
    const content = e.target.value
    if (e.key === 'Tab') {
      if (textLength === pointStart) {
        const newContent = content + '  '
        setContent(newContent)
        textareaRef.current.value = newContent
        return e.preventDefault()
      } else {
        const newContent = content.slice(0, pointStart) + '  ' + content.slice(pointEnd)
        e.target.setSelectionRange(pointStart + 2, pointStart + 2)
        textareaRef.current.value = newContent
        setContent(newContent)
        return e.preventDefault()
      }
    }
  }
  return (
    <div className='edit-wrap'>
      <textarea 
        ref={textareaRef}
        onInput={onInput}
        onKeyDown={onEnterKey}
      />
      <pre>
        <code ref={codeRef} className="language-markdown line-numbers">
          {content}
        </code>
      </pre>
    </div>
  )
}
