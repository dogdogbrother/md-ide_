import { Button, Form, Input, Select } from 'antd'

function AddDoc(props) {
  const { menu, validateinfo, close, onFinish, defaultInfo } = props

  return <Form 
    name='addDirDoc'
    labelCol={{ span: 5 }}
    wrapperCol={{ span: 19 }}
    labelAlign="left"
    onFinish={onFinish}
    colon={false}
  >
    <Form.Item label='目录' name='dirName' initialValue={defaultInfo.dirName}>
      <Select 
        defaultValue={defaultInfo.dirName}
        options={[
          { value: '', label: '根目录'},
          ...menu
        ]}
      ></Select>
    </Form.Item>
    <Form.Item 
      label='文档名称' 
      name='docName' 
      validateStatus={validateinfo.validateStatus} 
      help={validateinfo.help}
    >
      <Input addonAfter=".md"/>
    </Form.Item>
    <Form.Item wrapperCol={{ offset: 5, span: 19 }} style={{ marginBottom: '0px' }}>
      <div className='btn-wrap'>
        <Button onClick={close}>取消</Button>
        <Button type='primary' htmlType='submit'>确定</Button>
      </div>
    </Form.Item>
  </Form>
}

export default AddDoc