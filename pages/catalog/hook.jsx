import { useEffect, useState } from 'react'

// 右键开启菜单
export function useContextMenu(catalogStore) {
  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault()
      const { localName, innerText, dataset = {} } = e.target
      // localName 可能是li ul 和 div
      if (localName === 'ul' || localName === 'div') {
        return catalogStore.emptyMenu()
      }
      // 右键 li 也分3种情况 双击的是文件夹还是md文档,还是文件夹下的md文档
      const { doc, dir } = dataset
      console.log(doc, dir);
      // 右键文件夹
      if (dir && !doc) {
        return catalogStore.createDirMenu(dir)
      }
      if (dir && doc) {
        return catalogStore.createDirDocMenu(dir, doc)
      }
      return catalogStore.eidtDoc(innerText || dataset.name)
    }
    window.addEventListener('contextmenu', handleContextMenu)
  }, [])
}

// 右键开启菜单录入根文件
export function DocInput({catalogStore}) {
  function onDocName(e) {
    const docsName = catalogStore.menus.filter(menu => menu.type === 'md')
    catalogStore.setIsRepeat(!!docsName.find(menu => e.target.value === menu.name))
  }
  function onCreateDoc(e) {
    catalogStore.setIsRepeat(false)

    catalogStore.setAddDocState(false)
    if (!e.target.value) return
    // 如果是重复的 通知主程序发送通知  (暂时不实现)
    if(!catalogStore.isRepeat) {
      catalogStore.addDoc(e.target.value)
    }
  }
  return <div className='input-wrap'>
    <input 
      className={catalogStore.isRepeat ? 'repeat' : ''}
      autoFocus 
      type="text" 
      onInput={onDocName} 
      onBlur={onCreateDoc}
      placeholder='请输入文档名' 
    />
    {
      catalogStore.isRepeat && <div className='tip'>文档名字重复啦~</div>
    }
  </div>
}

// 右键开启文件录入根目录
export function DirInput({catalogStore}) {
  function onDirName(e) {
    const dirsName = catalogStore.menus.filter(menu => menu.type === 'dir')
    catalogStore.setIsRepeat(!!dirsName.find(menu => e.target.value === menu.name))
  }
  function onCreateDir(e) {
    if(!catalogStore.isRepeat) {
      catalogStore.addDir(e.target.value)
    } 
    catalogStore.setAddDirState(false)
    catalogStore.setIsRepeat(false)
  }
  return <div className='input-wrap'>
    <input 
      className={catalogStore.isRepeat ? 'repeat' : ''}
      autoFocus 
      type="text" 
      onInput={onDirName} 
      onBlur={onCreateDir}
      placeholder='请输入文件夹名' 
    />
    {
      catalogStore.isRepeat && <div className='tip'>文件夹名字重复啦~</div>
    }
  </div>
}

// 在文件夹下添加文档
export function DirDocInput({catalogStore, dir}) {
  const [isRepeat, setIsRepeat] = useState(false)
  function onDocName(e) {
    const { children } = dir
    setIsRepeat(!!children.find(item => item.name === e.target.value))
  }
  function onCreateDoc(e) {
    if (!isRepeat) {
      catalogStore.addDirDoc(dir.name, e.target.value)
    }
    catalogStore.setDirDocState(dir.name, false)
    setIsRepeat(false)
  }
  return <div className='input-wrap sub'>
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