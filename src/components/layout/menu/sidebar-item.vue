<template>
  <a-menu-item v-if="item.path" :key="item.path" @click="onMenuItemClick(item)">
    <item-view :icon="item.icon" :title="item.title" />
  </a-menu-item>

  <a-sub-menu v-else :key="'submenu' + item.id">
    <template #title>
      <item-view :icon="item.icon" :title="item.title" />
    </template>
    <sidebar-item v-for="child in item.children" :key="child.id" :item="child">
      {{ child.title }}
    </sidebar-item>
  </a-sub-menu>
</template>

<script>
import { isExternal } from '@/utils/validate'
import ItemView from './item-view.vue'

export default {
  name: 'SidebarItem',
  components: { ItemView },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    onMenuItemClick({ path }) {
      if (isExternal(path)) {
        window.open(path, '_blank')
      } else {
        this.$router.push({
          path
        })
      }
    }
  }
}
</script>
