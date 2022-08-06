import { parseTime } from '@/utils/time'

// 下载文件
export function downloadFile(obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = url
  const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  tempLink.setAttribute('download', fileName)
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  // 释放blob URL地址
  window.URL.revokeObjectURL(url)
}
