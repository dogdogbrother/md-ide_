import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class DocStore {
  doc = null  // 当前的文档内容
  docName = null  // 文档文件名
  constructor() {
    makeAutoObservable(this)
    ipcRenderer.on('viewDoc', (_event, docInfo) => {
      const { doc, docName } = JSON.parse(docInfo)
      this.setDoc(doc)
      this.setDocName(docName)
    })
    setInterval(() => {
      if (!this.doc || !this.docName) return
      ipcRenderer.send('saveDoc', JSON.stringify({
        doc: this.doc,
        docName: this.docName
      }))
    }, 5000)
  }
  setDoc(doc) {
    this.doc = doc
  }
  setDocName(docName) {
    this.docName = docName
  }
}

export default new DocStore()