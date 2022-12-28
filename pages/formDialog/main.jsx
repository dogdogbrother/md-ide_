import ReactDOM from 'react-dom/client'
import { ConfigProvider, Button, Form, Input, Select } from 'antd'
import './index.less'
import { useState, useEffect } from 'react'
import AddDoc from './component/addDoc'

const { ipcRenderer } = require('electron')

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
)

function App() {
  const [menu, setmMenu] = useState([])
  const [allDoc, setAllDoc] = useState([])
  const [actionType, setActionType] = useState(null)
  const theme = {
    token: {
      screenXS: 300,
      screenXSMax: 320,
      screenXSMin: 300,
      colorPrimary: '#845EC2'
    }
  }
  const onFinish = (values) => {
    const { dirName, docName } = values
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
      const findDirDoc = allDoc.filter(doc => doc.type === 'dir').map(doc => doc.children).find(doc => doc.name === docName)
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
    ipcRenderer.once('getAction', (_e, action) => {
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
      <AddDoc />
      {/* <Form 
        name='addRootDoc'
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        labelAlign="left"
        onFinish={onFinish}
      >
        <Form.Item label='目录' name='dirName'>
          <Select 
            defaultValue=''
            options={[
              { value: '', label: '根目录'},
              ...menu
            ]}
          ></Select>
        </Form.Item>
        <Form.Item label='文档名称' name='docName' validateStatus={validateinfo.validateStatus} help={validateinfo.help} >
          <Input addonAfter=".md"/>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 5, span: 19 }} style={{ marginBottom: '0px' }}>
          <div className='btn-wrap'>
            <Button onClick={close}>取消</Button>
            <Button type='primary' htmlType='submit'>确定</Button>
          </div>
        </Form.Item>
      </Form> */}
    </div>
  </ConfigProvider>
}