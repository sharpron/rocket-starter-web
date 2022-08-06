<template>
  <a-menu
    class="menu"
    v-model:collapsed="collapsed"
    @update:collapsed="onCollapsed"
    show-collapse-button
    :default-selected-keys="defaultSelectedKeys"
    auto-open-selected
    :level-indent="20"
    breakpoint="xl"
  >
    <sidebar-item v-for="menu in menus" :key="menu.id" :item="menu" />
  </a-menu>
</template>

<script>
import { ref, computed } from 'vue'
import useUserStore from '@/store/user/'
import SidebarItem from './sidebar-item.vue'
import { listenerRouteChange } from '@/router/route-listener'
export default {
  components: {
    SidebarItem
  },
  props: {
    collapsed: {
      type: Boolean,
      required: false
    }
  },
  emits: ['update:collapsed'],
  setup(_props, ctx) {
    const userStore = useUserStore()
    const menus = computed(() => {
      return userStore.appAsyncMenus
    })

    const defaultSelectedKeys = ref([])

    listenerRouteChange((route) => {
      defaultSelectedKeys.value = [route.path]
    })

    const onCollapsed = (val) => {
      ctx.emit('update:collapsed', val)
    }

    return {
      menus,
      onCollapsed,
      defaultSelectedKeys
    }
  }
}
</script>
