import { checkPermission } from '@/utils/permission'

function handlePermission(el, binding) {
  const { value } = binding
  const hasPermission = checkPermission(value)
  el.style.display = hasPermission ? 'block' : 'none'
}

export default {
  mounted(el, binding) {
    handlePermission(el, binding)
  },
  updated(el, binding) {
    handlePermission(el, binding)
  }
}
