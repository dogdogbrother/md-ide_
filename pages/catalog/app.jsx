import './index.css'
import catalogStore from '@/store/catalog'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { MdiLanguageMarkdown, MdiFolderDownload, MdiArrowRightThin } from '../../src/assets/svg'
import classnames from 'classnames'

function App() {
  const [isRepeat, setIsRepeat] = useState(false)
  // 控制展开的文件夹
  const [unfold, setUnfold] = useState([])
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
  const changeFolder = mune => () => {
    if (unfold.includes(mune.name)) {
      setUnfold(unfold.filter(name => name !== mune.name))
    } else setUnfold([...unfold, mune.name])
    
  }
  return <div className='catalog-wrap'>
    <ul>
      {catalogStore.menus.filter(menu => menu.type === 'dir').map(mune => (
        <div key={mune.name}>
          <li 
            className={classnames(
              'dir',
              {'is-unfold': unfold.includes(mune.name)}
            )}
            onClick={changeFolder(mune)}
          >
            <MdiFolderDownload />
            <span>{mune.name}</span>
            <MdiArrowRightThin className='arrow' />
          </li>
          {
            mune.children.map(doc => <li 
              className={classnames(
                'dir-md',
                {'is-unfold': unfold.includes(mune.name)},
                {'active': catalogStore.currentMenuName === doc.name}
              )}
              key={doc.name}
              onClick={onCheck(doc.name)}
            >
              <MdiLanguageMarkdown data-name={doc.name}/>
              {doc.name}
            </li>)
          }
        </div>
        
        // <li 
        //   key={mune} 
        //   onClick={onCheck(mune)}
        //   className={catalogStore.currentMenuName === mune ? 'active' : ''}
        // >
        //   <MdiLanguageMarkdown data-name={mune}/>
        //   {mune}
        // </li>
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
