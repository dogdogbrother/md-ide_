import './index.css'
import catalogStore from '@/store/catalog'
import { observer } from 'mobx-react-lite'

function App() {
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
        >{mune}</li>
      ))}
    </ul>
  </div>
}

export default observer(App)
