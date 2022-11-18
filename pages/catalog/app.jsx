import './index.css'
import { useEffect, useState } from 'react'
const { ipcRenderer } = require('electron')

export function App() {
  const [munes, setMenus] = useState([])
  useEffect(() => {
    ipcRenderer.send('getDocs')
    // 因为监听的执行慢于主进程,所以还要去主动拉一些
    ipcRenderer.on('viewDocs', (_event, info) => {
      setMenus(JSON.parse(info))
    })
  }, [])
  return <div className='catalog-wrap'>
    <ul>
      {munes.map(mune => (<li key={mune}>{mune}</li>))}
    </ul>
  </div>
}
