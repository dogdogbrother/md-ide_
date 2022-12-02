const { getConfig } = require('./appPath')
const fs = require('fs')
const { v4 } = require('uuid')

function getDocs() {
  const { md_file } = getConfig()
  const docPath = md_file + '/docs'
  const docsDir = fs.readdirSync(docPath)
  return docsDir.filter(file => file.includes('.md')).map(getDocFn)
}

function getDir() {
  const { md_file } = getConfig()
  const docPath = md_file + '/docs'
  const docsDir = fs.readdirSync(docPath)
  // 暂时判定 没有 .md 的都是文件夹  并且排除img文件夹
  return docsDir.filter(file => !file.includes('.md') && file !== 'img')
}
function getAllDoc() {
  const dir = []
  const { md_file } = getConfig()
  getDir().forEach(item => {
    const fullPath = md_file + '/docs' + '/' + item
    const stats = fs.statSync(fullPath)
    if (!stats.isFile()) {
      const files = fs.readdirSync(fullPath)
      const dcos = files.filter(file => file.includes('.md')).map(getDocFn)
      dir.push({
        type: 'dir',
        name: item,
        children: dcos
      })
    }
  })
  return [...dir, ...getDocs()]
}

// 最终生成文档对象的回调方法
const getDocFn = file => {
  return {
    type: 'md',
    name: file.split('.md')[0]
  }
}

// 把插入的图片 复制大盘 dpc
function setDocImg(imgPath) {
  const { md_file } = getConfig()
  const docPath = md_file + '/docs'
  const split = imgPath[0].split('.')
  const extensions = split[split.length - 1]
  const _img_path = `/img/${v4()}.${extensions}`
  const respath = `${docPath}${_img_path}`
  fs.copyFileSync(imgPath[0], respath)
  return _img_path
}
module.exports = {
  getAllDoc,
  setDocImg
}
