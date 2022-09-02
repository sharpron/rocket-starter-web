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
        <a-layout-header class="layout-header">
          <tab-bar />
        </a-layout-header>

        <a-layout-content class="layout-content">
          <router-view v-slot="{ Component, route }">
            <transition name="slide-fade" mode="out-in" appear>
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
import { computed, ref } from 'vue'
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
    height: calc(100vh - 60px);
  }

  .layout-header {
    border-bottom: 1px solid var(--color-border);
  }

  .layout-content {
    .main-content {
      height: calc(100vh - 94px);
      overflow: auto;
      padding: 30px 20px;
      box-sizing: border-box;
    }

    .slide-fade-enter-active {
      transition: all 0.2s ease-out;
    }

    .slide-fade-leave-active {
      transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
    }

    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  .main {
    background: var(--color-border-1);
  }
}
</style>
