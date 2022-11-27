import './index.css'
import catalogStore from '@/store/catalog'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { MdiLanguageMarkdown } from '../../src/assets/svg'

function App() {
  const [isRepeat, setIsRepeat] = useState(false)
  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault()
      const { localName, innerText, dataset } = e.target
      // localName 可能是li ul 和 div
      if (localName === 'ul' || localName === 'div') {
        return catalogStore.addDoc()
      }
      return catalogStore.eidtDoc(innerText || dataset.name)
    }
    window.addEventListener('contextmenu', handleContextMenu)
  }, [])
  function onDocName(e) {
    setIsRepeat(!!catalogStore.menus.find(menu => e.target.value === menu))
  }
  function onCreateDoc(e) {
    // 如果是重复的 通知主程序发送通知  (暂时不实现)
    if(isRepeat) {

    } else {
      catalogStore.setAddState(false)
      catalogStore.addDoc(e.target.value)
    }
  }
  const onCheck = mune => () => {
    catalogStore.setCurrentMenuName(mune)
  } 
  return <div className='catalog-wrap'>
    <ul>
      {catalogStore.menus.map(mune => (
        <li 
          key={mune} 
          onClick={onCheck(mune)}
          className={catalogStore.currentMenuName === mune ? 'active' : ''}
        >
          <MdiLanguageMarkdown data-name={mune}/>
          {mune}
        </li>
      ))}
      {
        catalogStore.addState 
        && 
        <div className='input-wrap'>
          <input 
            className={isRepeat ? 'repeat' : ''}
            autoFocus 
            type="text" 
            onInput={onDocName} 
            onBlur={onCreateDoc}
            placeholder='请输入文件名' 
          />
          {
            isRepeat && <div className='tip'>名字重复啦~</div>
          }
        </div>
      }
    </ul>
  </div>
}

export default observer(App)
