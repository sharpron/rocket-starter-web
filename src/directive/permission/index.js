import useUserStore from '@/store/user/';

function checkPermission(el, binding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { perms } = userStore;

  const hasPermission = perms.includes(value);
  if (!hasPermission) {
    const parentNode = el.parentNode
    // 对a-space组件下的组件进行特殊处理
    if (parentNode.className.includes('arco-space-item')) {
      parentNode.parentNode && parentNode.parentNode.removeChild(parentNode)
    } else {
      parentNode.removeChild(el);
    }
  }
}

export default {
  mounted(el, binding) {
    checkPermission(el, binding);
  },
  updated(el, binding) {
    checkPermission(el, binding);
  },
};
