<template>
  <div class="tab-bar-container">
    <div class="tab-bar-box">
      <div class="tab-bar-scroll">
        <div class="tags-wrap">
          <tab-item
            v-for="(tag, index) in tagList"
            :key="tag.fullPath"
            :index="index"
            :item-data="tag"
          />
        </div>
      </div>
      <div class="tag-bar-operation"></div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import useAppStore from '@/store/app'
import useTabBarStore from '@/store/tab-bar'
import tabItem from './tab-item.vue'
import { listenerRouteChange } from '@/router/route-listener'

export default {
  name: 'TabBar',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    tabItem
  },

  setup() {
    const appStore = useAppStore()
    const tabBarStore = useTabBarStore()

    const affixRef = ref()
    const tagList = computed(() => {
      return tabBarStore.getTabList
    })

    watch(
      () => appStore.navbar,
      () => {
        affixRef.value.updatePosition()
      }
    )
    listenerRouteChange((route) => {
      if (!tagList.value.some((tag) => tag.fullPath === route.fullPath)) {
        tabBarStore.updateTabList(route)
      }
    })

    return {
      tagList
    }
  }
}
</script>

<style scoped lang="less">
.tab-bar-container {
  position: relative;
  background-color: var(--color-bg-2);

  .tab-bar-box {
    display: flex;
    padding: 0 0 0 20px;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);

    .tab-bar-scroll {
      flex: 1;
      height: 32px;
      overflow: hidden;

      .tags-wrap {
        height: 48px;
        padding: 4px 0;
        overflow-x: auto;
        white-space: nowrap;

        :deep(.arco-tag) {
          display: inline-flex;
          align-items: center;
          margin-right: 6px;
          cursor: pointer;

          &:first-child {
            .arco-tag-close-btn {
              display: none;
            }
          }
        }
      }
    }
  }

  .tag-bar-operation {
    width: 100px;
    height: 32px;
  }
}
</style>
