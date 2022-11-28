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
    const docsName = catalogStore.menus.filter(menu => menu.type === 'md')
    setIsRepeat(!!docsName.find(menu => e.target.value === menu.name))
  }
  function onDirName(e) {
    const dirsName = catalogStore.menus.filter(menu => menu.type === 'dir')
    setIsRepeat(!!dirsName.find(menu => e.target.value === menu.name))
  }
  function onCreateDir(e) {
    // 如果是重复的 通知主程序发送通知  (暂时不实现)
    if(isRepeat) {
      catalogStore.setAddDirState(false)
    } else {
      catalogStore.setAddDirState(false)
      catalogStore.addDir(e.target.value)
    }
    setIsRepeat(false)
  }
  function onCreateDoc(e) {
    // 如果是重复的 通知主程序发送通知  (暂时不实现)
    if(isRepeat) {
      catalogStore.setAddDocState(false)
    } else {
      catalogStore.setAddDocState(false)
      catalogStore.addDoc(e.target.value)
    }
    setIsRepeat(false)
  }
  const onCheck = (docName, menuName) => () => {
    catalogStore.setCurrentMenuName(docName, menuName)
  } 
  const changeFolder = mune => () => {
    if (unfold.includes(mune.name)) {
      setUnfold(unfold.filter(name => name !== mune.name))
    } else setUnfold([...unfold, mune.name])
    
  }
  return <div className='catalog-wrap'>
    <ul>
      {/* 渲染文件夹及下面的md文档 */}
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
                {'active': catalogStore.currentMenuName === doc.name && catalogStore.currentDirName === mune.name}
              )}
              key={doc.name}
              onClick={onCheck(doc.name, mune.name)}
            >
              <MdiLanguageMarkdown data-name={doc.name}/>
              {doc.name}
            </li>)
          }
        </div>
      ))}
      {catalogStore.menus.filter(menu => menu.type !== 'dir').map(mune => (
        <li 
          key={mune.name} 
          onClick={onCheck(mune.name)}
          className={classnames(
            {'active': catalogStore.currentMenuName === mune.name && !catalogStore.currentDirName}
          )}
        >
          <MdiLanguageMarkdown data-name={mune.name}/>
          {mune.name}
        </li>
      ))}
      {
        catalogStore.addDocState 
        && 
        <div className='input-wrap'>
          <input 
            className={isRepeat ? 'repeat' : ''}
            autoFocus 
            type="text" 
            onInput={onDocName} 
            onBlur={onCreateDoc}
            placeholder='请输入文档名' 
          />
          {
            isRepeat && <div className='tip'>文档名字重复啦~</div>
          }
        </div>
      }
      {
        catalogStore.addDirState 
        && 
        <div className='input-wrap'>
          <input 
            className={isRepeat ? 'repeat' : ''}
            autoFocus 
            type="text" 
            onInput={onDirName} 
            onBlur={onCreateDir}
            placeholder='请输入文件夹名' 
          />
          {
            isRepeat && <div className='tip'>文件夹名字重复啦~</div>
          }
        </div>
      }
    </ul>
  </div>
}

export default observer(App)
