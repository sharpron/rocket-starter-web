import { checkPermission } from '@/utils/permission'

function handlePermission(el, binding) {
  const { value } = binding
  const hasPermission = checkPermission(value)

  if (!hasPermission) {
    const parentNode = el.parentNode
    // 对a-space组件下的组件进行特殊处理
    if (parentNode.className.includes('arco-space-item')) {
      parentNode.parentNode && parentNode.parentNode.removeChild(parentNode)
    } else {
      parentNode.removeChild(el)
    }
  }
}

export default {
  mounted(el, binding) {
    handlePermission(el, binding)
  },
  updated(el, binding) {
    handlePermission(el, binding)
  }
}
