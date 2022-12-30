import './index.less'
import catalogStore from '@/store/catalog'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { MdiLanguageMarkdown, MdiFolderDownload, MdiArrowRightThin } from '../../src/assets/svg'
import classnames from 'classnames'
import { useContextMenu } from './hook'

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
              <MdiLanguageMarkdown data-doc={doc.name} data-dir={mune.name}/>
              <span data-doc={doc.name} data-dir={mune.name} title={doc.name}>{doc.name}</span>
            </li>)
          }
        </div>
      ))}
      {catalogStore.menus.filter(menu => menu.type !== 'dir').map(mune => (
        <li 
          data-doc={mune.name}
          key={mune.name} 
          onClick={onCheck(mune.name)}
          className={classnames(
            {'active': catalogStore.currentMenuName === mune.name && !catalogStore.currentDirName}
          )}
        >
          <MdiLanguageMarkdown data-doc={mune.name}/>
          <span data-doc={mune.name} title={mune.name}>{mune.name}</span>
        </li>
      ))}
    </ul>
  </div>
}

export default observer(App)
