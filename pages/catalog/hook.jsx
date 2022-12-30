import { useEffect, useState } from 'react'

// 右键开启菜单
export function useContextMenu(catalogStore) {
  useEffect(() => {
    function handleContextMenu(e) {
      e.preventDefault()
      const { localName, dataset = {} } = e.target
      // localName 可能是li ul 和 div,都不是就是点击在空白处了
      if (localName === 'ul' || localName === 'div') {
        return catalogStore.emptyMenu()
      }
      // 右键 li 也分3种情况 双击的是文件夹还是md文档,还是文件夹下的md文档
      const { doc, dir } = dataset
      // 右键文件夹 创建文档
      if (dir && !doc) {
        return catalogStore.createDirMenu(dir)
      }
      // 右键文档
      if (doc) {
        const docInfo = {
          dirName: dir,
          docName: doc
        }
        return catalogStore.editDoc(JSON.stringify(docInfo))
      }
    }
    window.addEventListener('contextmenu', handleContextMenu)
  }, [])
}