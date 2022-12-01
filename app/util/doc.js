const { getConfig } = require('./appPath')
const fs = require('fs')

const { md_file } = getConfig()

function getDocs() {
  const docsDir = fs.readdirSync(md_file + '/docs')
  return docsDir.filter(file => file.includes('.md')).map(getDocFn)
}

function getDir() {
  const docsDir = fs.readdirSync(md_file + '/docs')
  // 暂时判定 没有 .md 的都是文件夹  并且排除img文件夹
  return docsDir.filter(file => !file.includes('.md') && file !== 'img')
}
function getAllDoc() {
  const dir = []
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

module.exports = {
  getAllDoc
}
