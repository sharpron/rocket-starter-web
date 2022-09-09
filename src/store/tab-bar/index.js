import useUserStore from '../user'
import { defineStore } from 'pinia'

const createTag = (route, meta) => {
  const { name, fullPath, path, query } = route
  const finalMeta = meta || route.meta
  return {
    title: finalMeta.title,
    name: String(name),
    fullPath: fullPath || path,
    query,
    cacheable: finalMeta.cacheable
  }
}

const useTabBarStore = defineStore('tabBar', {
  state: () => ({
    caches: new Set(),
    tags: []
  }),

  getters: {
    getCacheList() {
      return Array.from(this.caches)
    }
  },

  actions: {
    addTagWithRoute(route) {
      if (this.tags.some((e) => e.name === route.name)) return
      const meta = this.getRouteMeta(route)
      this.tags.push(createTag(route, meta))
      if (meta.cacheable) {
        this.caches.add(route.name)
      }
    },
    getRouteMeta(route) {
      const userStore = useUserStore()
      return userStore.appMenuMetas[route.fullPath] || route.meta
    },
    deleteByIndex(index) {
      this.caches.delete(this.tags[index].name)
      this.tags.splice(index, 1)
    },
    deleteTagsWithExcludes(start, index) {
      this.tags = this.tags.slice(0, start).concat(this.tags.slice(index, 1))
    },
    deleteTagsByRange(start, end) {
      // Delete route from caches.
      for (let i = start; i < end; i++) {
        const tag = this.tags[i]
        this.caches.delete(tag.name)
      }
      this.tags.splice(start, end - start)
    }
  }
})

export default useTabBarStore
