<template>
  <a-menu
    class="menu"
    v-model:collapsed="collapsedValue"
    show-collapse-button
    :selected-keys="defaultSelectedKeys"
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

import { useVModel } from '@vueuse/core'
export default {
  name: 'LayoutMenu',
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
  setup(props, { emit }) {
    const collapsedValue = useVModel(props, 'collapsed', emit)
    const userStore = useUserStore()
    const menus = computed(() => {
      return userStore.appAsyncMenus
    })

    const defaultSelectedKeys = ref([])

    listenerRouteChange((route) => {
      defaultSelectedKeys.value = [route.path]
    })

    return {
      menus,
      defaultSelectedKeys,
      collapsedValue
    }
  }
}
</script>
