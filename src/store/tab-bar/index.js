import useUserStore from '../user'
import { defineStore } from 'pinia'

const createTag = (route, meta) => {
  const { name, fullPath, query } = route
  return {
    title: meta.title,
    name: String(name),
    fullPath,
    query,
    cacheable: meta.cacheable
  }
}

const useTabBarStore = defineStore('tabBar', {
  state: () => ({
    caches: new Set(),
    tags: []
  }),

  getters: {
    getTabList() {
      return this.tags
    },
    getCacheList() {
      return Array.from(this.caches)
    }
  },

  actions: {
    updateTabList(route) {
      const userStore = useUserStore()
      const meta = userStore.appMenuMetas[route.fullPath]
      this.tags.push(createTag(route, meta))
      if (meta.cacheable) {
        this.caches.add(route.name)
      }
    },
    deleteTag(idx, tag) {
      this.tags.splice(idx, 1)
      this.caches.delete(tag.name)
    },
    freshTabList(tags) {
      this.tags = tags
      this.caches.clear()
      this.tags
        .filter((el) => el.cacheable)
        .map((el) => el.name)
        .forEach((x) => this.caches.add(x))
    },
    resetTabList() {
      this.tags.splice(1, this.tags.length)
      this.caches.clear()
    }
  }
})

export default useTabBarStore
