<template>
  <a-layout class="layout">
    <a-layout-header>
      <nav-bar />
    </a-layout-header>
    <a-layout class="main">
      <a-layout-sider breakpoint="xl" :width="220" :collapsed="collapsed">
        <Menu v-model:collapsed="collapsed" />
      </a-layout-sider>
      <a-layout style="overflow: hidden">
        <a-layout-header>
          <tab-bar />
        </a-layout-header>

        <a-layout-content class="layout-content">
          <router-view v-slot="{ Component, route }">
            <transition name="fade" mode="out-in" appear>
              <keep-alive :include="cacheList">
                <div
                  class="main-content"
                  :bordered="false"
                  :key="route.fullPath"
                >
                  <component :is="Component" />
                </div>
              </keep-alive>
            </transition>
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import { computed, ref, watch } from 'vue'
import useTabBarStore from '@/store/tab-bar/'

import Menu from './menu/index.vue'
import NavBar from './navbar/index.vue'
import TabBar from './tab-bar/index.vue'

export default {
  name: 'LayoutComponent',
  components: {
    Menu,
    NavBar,
    TabBar
  },
  setup() {
    const collapsed = ref(false)
    const tabBarStore = useTabBarStore()
    const cacheList = computed(() => tabBarStore.getCacheList)

    return {
      cacheList,
      collapsed
    }
  }
}
</script>
<style scoped lang="less">
.layout {
  .menu {
    height: 100%;
  }

  .layout-content {
    .main-content {
      height: calc(100vh - 94px);
      overflow: auto;
      padding: 30px 20px;
      box-sizing: border-box;
    }

    ::-webkit-scrollbar {
      width: 15px;
    }

    ::-webkit-scrollbar-thumb {
      border: 4px solid transparent;
      background-clip: padding-box;
      border-radius: 7px;
      background-color: var(--color-text-4);
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: var(--color-text-3);
    }
  }

  .main {
    background: var(--color-border-1);
  }
}
</style>
