import './index.less'
import catalogStore from '@/store/catalog'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { MdiLanguageMarkdown, MdiFolderDownload, MdiArrowRightThin } from '../../src/assets/svg'
import classnames from 'classnames'
import { useContextMenu, DocInput, DirInput, DirDocInput } from './hook'

function App() {
  useContextMenu(catalogStore)
  const [unfold, setUnfold] = useState([])
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
            data-dir={mune.name}
            onClick={changeFolder(mune)}
          >
            <MdiFolderDownload data-dir={mune.name} />
            <span data-dir={mune.name}>{mune.name}</span>
            {
              mune.children.length ? <MdiArrowRightThin data-dir={mune.name} className='arrow' /> : null
            }
          </li>
          {
            mune.children.map(doc => <li 
              data-dir={mune.name}
              data-doc={doc.name}
              className={classnames(
                'dir-md',
                {'is-unfold': unfold.includes(mune.name)},
                {'active': catalogStore.currentMenuName === doc.name && catalogStore.currentDirName === mune.name}
              )}
              key={doc.name}
              onClick={onCheck(doc.name, mune.name)}
            >
              <MdiLanguageMarkdown data-name={doc.name} data-dir={mune.name}/>
              <span title={doc.name}>{doc.name}</span>
            </li>)
          }
          {
            catalogStore.dirDocState[mune.name]
            && 
            <DirDocInput 
              catalogStore={catalogStore}
              dir={mune}
            />
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
          <span title={mune.name}>{mune.name}</span>
        </li>
      ))}
      {
        catalogStore.addDocState 
        && 
        <DocInput catalogStore={catalogStore} />
      }
      {
        catalogStore.addDirState 
        && 
        <DirInput catalogStore={catalogStore} />
      }
    </ul>
  </div>
}

export default observer(App)
