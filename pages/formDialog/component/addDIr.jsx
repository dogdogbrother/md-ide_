import { Button, Form, Input } from 'antd'

function AddDir(props) {
  const { validateinfo, close, onFinish, defaultInfo } = props

  return <Form 
    name='addDir'
    labelCol={{ span: 5 }}
    wrapperCol={{ span: 19 }}
    labelAlign="left"
    onFinish={onFinish}
    colon={false}
  >
    <Form.Item 
      label='文件夹名' 
      name='dirName' 
      initialValue={defaultInfo.dirName}
      validateStatus={validateinfo.validateStatus} 
      help={validateinfo.help}
    >
      <Input />
    </Form.Item>
    <Form.Item wrapperCol={{ offset: 5, span: 19 }} style={{ marginBottom: '0px' }}>
      <div className='btn-wrap'>
        <Button onClick={close}>取消</Button>
        <Button type='primary' htmlType='submit'>确定</Button>
      </div>
    </Form.Item>
  </Form>
}

export default AddDir