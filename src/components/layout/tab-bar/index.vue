<template>
  <div class="tab-bar-container">
    <a-space>
      <a-dropdown
        v-for="(tag, index) in tags"
        :key="tag"
        trigger="contextMenu"
        @select="(value) => actionSelect(value, index)"
      >
        <a-tag
          class="tag-link"
          :closable="index >= affixLength"
          :checked="tag.fullPath === $route.fullPath"
          checkable
          @check="goto(tag)"
          @close="tagClose(index)"
          >{{ tag.title }}</a-tag
        >
        <template #content>
          <a-doption
            :disabled="index < affixLength"
            :value="CloseAction.current"
          >
            <icon-close />
            <span>关闭当前标签页</span>
          </a-doption>
          <a-doption :disabled="index <= affixLength" :value="CloseAction.left">
            <icon-to-left />
            <span>关闭左侧标签页</span>
          </a-doption>
          <a-doption
            :disabled="index === tags.length - 1"
            :value="CloseAction.right"
          >
            <icon-to-right />
            <span>关闭右侧标签页</span>
          </a-doption>
          <a-doption :value="CloseAction.others">
            <icon-swap />
            <span>关闭其它标签页</span>
          </a-doption>
          <a-doption :value="CloseAction.all">
            <icon-folder-delete />
            <span>关闭全部标签页</span>
          </a-doption>
        </template>
      </a-dropdown>
    </a-space>
  </div>
</template>

<script>
import { computed } from 'vue'
import useTabBarStore from '@/store/tab-bar'
import { useRouter, useRoute } from 'vue-router'
import { listenerRouteChange } from '@/router/route-listener'

export default {
  name: 'TabBar',
  functional: true,

  setup() {
    const tabBarStore = useTabBarStore()
    const router = useRouter()
    // add affix routes.
    const affixRoutes = router
      .getRoutes()
      .filter((e) => tabBarStore.getRouteMeta(e).affix || false)
    affixRoutes.forEach((e) => tabBarStore.addTagWithRoute(e))

    // add router listener.
    listenerRouteChange((route) => {
      tabBarStore.addTagWithRoute(route)
    })

    // Retain affix length.
    const affixLength = affixRoutes.length

    const goto = (tag) => {
      router.push({ ...tag })
    }

    const tags = computed(() => {
      return tabBarStore.tags
    })

    const CloseAction = {
      current: 'current',
      left: 'left',
      right: 'right',
      others: 'others',
      all: 'all'
    }

    const route = useRoute()
    // Checked route
    const checkedIndex = computed(() => {
      return tags.value.findIndex((e) => e.fullPath === route.fullPath)
    })

    const tagClose = (index) => {
      if (checkedIndex.value === index) {
        router.push({ ...tags.value[index - 1] })
      }
      tabBarStore.deleteByIndex(index)
    }

    const actionSelect = (value, index) => {
      if (value === CloseAction.current) {
        tagClose(index)
      } else if (value === CloseAction.left) {
        if (checkedIndex.value >= affixLength && checkedIndex.value < index) {
          router.push({ ...tags.value[index] })
        }
        tabBarStore.deleteTagsByRange(affixLength, index)
      } else if (value === CloseAction.right) {
        if (checkedIndex.value >= affixLength && checkedIndex.value > index) {
          router.push({ ...tags.value[index] })
        }
        tabBarStore.deleteTagsByRange(index + 1, tags.value.length)
      } else if (value === CloseAction.others) {
        if (
          checkedIndex.value >= affixLength &&
          checkedIndex.value < tags.value.length
        ) {
          router.push({ ...tags.value[index] })
        }
        tabBarStore.deleteTagsWithExcludes(affixLength, index)
      } else if (value === CloseAction.all) {
        if (
          checkedIndex.value >= affixLength &&
          checkedIndex.value < tags.value.length
        ) {
          router.push({ ...tags.value[affixLength - 1] })
        }
        // Delete the routes after the affix routes.
        tabBarStore.deleteTagsByRange(affixLength, tags.value.length)
      }
    }

    return {
      affixLength,
      tags,
      goto,
      CloseAction,
      tagClose,
      actionSelect
    }
  }
}
</script>

<style scoped lang="less">
.tab-bar-container {
  background: var(--color-bg-2);
  padding: 4px 20px;

  .tag-link {
    color: var(--color-text-2);
    text-decoration: none;

    &.arco-tag-checked {
      color: rgb(var(--link-6));
      .arco-tag-close-btn:hover {
        background: var(--color-fill-1);
      }
    }
    &:not(.arco-tag-checked) {
      background: var(--color-fill-2);
    }
  }
}
</style>
