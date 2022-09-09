import useUserStore from '@/store/user/'

/**
 * 检查用户是否拥有相关权限
 * @param {String | Array<String>} value
 */
export function checkPermission(value) {
  const userStore = useUserStore()
  const { perms } = userStore

  return Array.isArray(value)
    ? perms.some((e) => value.includes(e))
    : perms.includes(value)
}
