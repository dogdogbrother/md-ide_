import { makeAutoObservable } from "mobx"
const { ipcRenderer } = require('electron')

class DocStore {
  doc = null  // 当前的文档内容
  docName = null  // 文档文件名
  dirName = null
  insertValue = null  // 文档插入的内容
  timer = null
  imgPath = null  // 每次插入 此值都变,提醒编辑区域
  constructor() {
    makeAutoObservable(this)
    ipcRenderer.on('viewDoc', (_event, docInfo) => {
      const { doc, docName, dirName } = JSON.parse(docInfo)
      this.setDoc(doc)
      this.setDocName(docName)
      this.setDirName(dirName)
    })
    // 左侧删除了菜单,这里检查下,是不是当前显示的  是的话就清空
    ipcRenderer.on('isClearView', (_event, docName) => {
      if (this.docName === docName) {
        this.setDoc(null)
        this.setDocName(null)
      }
    })
    // 插入文档 暂时有插入js和css
    ipcRenderer.on('insert', (_event, insertType) => {
      if (insertType === 'mate') {
        this.setInsertValue(`---
title: ''
tags: ''
---`)
      }
      if (insertType === 'js') {
        this.setInsertValue(`\`\`\`js

\`\`\``)
      }
      if (insertType === 'css') {
        this.setInsertValue(`\`\`\`css

\`\`\``)
      }
    })
    // 插入图片
    ipcRenderer.on('insertImg', (_event, imgPath) => {
      this.setImgPath(imgPath)
    })
    this.setInterval()
  }
  setDoc(doc) {
    this.doc = doc
  }
  saveDoc() {
    clearInterval(this.timer)
    this.setInterval()
  }
  setDocName(docName) {
    this.docName = docName
  }
  // 通知主程序 建议编辑器的菜单
  createEditMenu() {
    ipcRenderer.send(
      'createEditMenu', 
      JSON.stringify({ docName: this.docName, dirName: this.dirName })
    )
  }
  setInsertValue(value) {
    this.insertValue = value
  }
  setInterval() {
    if (!this.doc || !this.docName) return
    ipcRenderer.send('saveDoc', JSON.stringify({
      doc: this.doc,
      docName: this.docName
    }))
    this.timer = setInterval(() => {
      if (!this.doc || !this.docName) return
      ipcRenderer.send('saveDoc', JSON.stringify({
        doc: this.doc,
        docName: this.docName
      }))
    }, 5000)
  }
  setDirName(dirName) {
    this.dirName = dirName
  }
  setImgPath(imgPath) {
    this.imgPath = imgPath
  }
}

export default new DocStore()