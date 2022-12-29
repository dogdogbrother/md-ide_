import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './index.less'
import { useState, useEffect } from 'react'
import AddDoc from './component/addDoc'
import AddDir from './component/addDIr'
import AddDirDoc from './component/addDirDoc'

const { ipcRenderer } = require('electron')

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)

function App() {
  const [menu, setmMenu] = useState([])
  const [allDoc, setAllDoc] = useState([])
  const [actionType, setActionType] = useState(null)
  // 默认的 dirName docName的信息
  const [defaultInfo, setDefaultInfo] = useState({ dirName: null, docName: null })
  const theme = {
    token: {
      screenXS: 300,
      screenXSMax: 320,
      screenXSMin: 300,
      colorPrimary: '#845EC2'
    }
  }
  const onFinish = (values) => {
    if (actionType === 'addRootDoc' || actionType === 'addDirDoc') {
      return addRootDoc(values)
    }
    if (actionType === 'addDir') {
      return addDir(values)
    }
    if (actionType === 'editDir') {
      return editDir(values)
    }
  }
  function addRootDoc(values) {
    const { dirName, docName } = values
    if (!docName) {
      return setValidateinfo({
        validateStatus: 'error',
        help: '文档名不能为空'
      })
    }
    // 如果dirName不存在 代表是根目录
    if (!dirName) {
      const findRootDoc = allDoc.filter(doc => doc.type === 'md').find(doc => doc.name === docName)
      if (findRootDoc) {
        setValidateinfo({
          validateStatus: 'error',
          help: '文档名已存在啦,换个吧'
        })
      } else {
        ipcRenderer.send('addDoc', JSON.stringify(values))
      }
    } else {
      // 先找到所有dir的 再返回 children 再找同名的
      const findDirDoc = allDoc.filter(doc => doc.type === 'dir' && doc.name === dirName)[0].children.find(doc => doc.name === docName)
      if (findDirDoc) {
        setValidateinfo({
          validateStatus: 'error',
          help: '文档名已存在啦,换个吧'
        })
      } else {
        ipcRenderer.send('addDoc', JSON.stringify(values))
      }
    }
  }
  function addDir(values) {
    const { dirName } = values
    if (!dirName) {
      return setValidateinfo({
        validateStatus: 'error',
        help: '文档名不能为空'
      })
    }
    const findDir = allDoc.filter(doc => doc.type === 'dir').find(dir => dir.name === dirName)
    if(findDir) {
      setValidateinfo({
        validateStatus: 'error',
        help: '文件夹名已存在啦,换个吧'
      })
    } else {
      ipcRenderer.send('addDir', dirName)
    }
  }
  function editDir(values) {
    const { dirName } = values
    // 代表没改名字
    if(defaultInfo.dirName === dirName) {
      return setValidateinfo({
        validateStatus: 'error',
        help: '这名字也没改啊,什么情况?'
      })
    }
    const findDir = allDoc.filter(doc => doc.type === 'dir').find(dir => (dir.name === dirName) && (dir.name !== defaultInfo.dirName))
    if (findDir) {
      setValidateinfo({
        validateStatus: 'error',
        help: '文件夹名已存在啦,换个吧'
      })
    } else {
      const renameInfo = {
        dirName,
        preDirName: defaultInfo.dirName
      }
      ipcRenderer.send('editDirName', JSON.stringify(renameInfo))
    }
  }
  const [validateinfo, setValidateinfo] = useState({
    validateStatus: null,
    help: null
  })
  useEffect(() => {
    ipcRenderer.on('docExist', () => {
      setValidateinfo({
        validateStatus: 'error',
        help: '文档名已存在啦,换个吧'
      })
    })
    ipcRenderer.once('getAllDoc', (_e, allDoc) => {
      const _allDoc = JSON.parse(allDoc)
      setmMenu(_allDoc.filter(doc => doc.type === 'dir').map(doc => ({value: doc.name, label: doc.name})))
      setAllDoc(_allDoc)
    })
    ipcRenderer.on('getAction', (_e, actionInfo) => {
      const { action, dirName, docName } = JSON.parse(actionInfo)
      setDefaultInfo({dirName, docName})
      setActionType(action)
    })
    ipcRenderer.send('getAllDoc')
    ipcRenderer.send('getAction')
  }, [])
  function close() {
    ipcRenderer.send('formDialogClose')
  }
  return <ConfigProvider theme={theme}>
    <div className='wrap'>
      {/* {
        (actionType === 'addRootDoc' || actionType === 'eidtDoc') && 
        <AddDoc menu={menu} defaultInfo={defaultInfo} validateinfo={validateinfo} close={close} onFinish={onFinish} />
      } */}
      {
        (actionType === 'addDir' || actionType === 'editDir') && <AddDir defaultInfo={defaultInfo} validateinfo={validateinfo} close={close} onFinish={onFinish} />
      }
      {/* {
        actionType === 'addDirDoc' && <AddDirDoc menu={menu} defaultInfo={defaultInfo} validateinfo={validateinfo} close={close} onFinish={onFinish} />
      } */}
    </div>
  </ConfigProvider>
}