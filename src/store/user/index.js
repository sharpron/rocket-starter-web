import { defineStore } from 'pinia'
import {
  login as userLogin,
  logout as userLogout,
  getUserInfo
} from '@/api/system/auth'
import { getSelfMenus } from '@/api/system/menu'


/**
 * 生成菜单
 * @param menus 菜单
 * @param metas 元数据
 * @returns 菜单
 */
function generateMenus(menus, metas) {
  return menus
    .filter((e) => e.type !== 'BUTTON')
    .filter(e => !e.hide)
    .map((e) => {
      if (e.path) {
        metas[e.path] = {
          title: e.title,
          icon: e.icon,
          cacheable: e.cacheable,
        }
      }
      return ({
        id: e.id,
        path: e.path,
        title: e.title,
        icon: e.icon,
        cacheable: e.cacheable,
        children: generateMenus(e.children, metas)
      })
    })
}

const useUserStore = defineStore('user', {
  state: () => ({
    userId: undefined,
    username: undefined,
    nickname: undefined,
    mobile: undefined,
    email: undefined,
    deptId: undefined,
    deptName: undefined,
    perms: undefined,
    manageDeptIds: undefined,
    serverMenu: undefined,
    menuMetas: {}
  }),

  getters: {
    appAsyncMenus(state) {
      return state.serverMenu
    },
    appMenuMetas(state) {
      return state.menuMetas
    }
  },

  actions: {
    // Reset user's information
    resetInfo() {
      this.$reset()
    },

    // Set user's information
    setInfo(partial) {
      this.$patch(partial)
    },

    // Get user's information
    async loadUserInfo() {
      const { data } = await getUserInfo()
      this.setInfo(data)
    },

    // Login
    async login(loginForm) {
      const { data } = await userLogin(loginForm)
      this.setInfo(data)
    },

    logoutCallBack() {
      this.resetInfo()
      this.clearServerMenus()
      window.location.reload()
    },

    // Logout
    async logout() {
      try {
        await userLogout()
      } finally {
        this.logoutCallBack()
      }
    },

    /**
     * 获取服务器菜单
     */
    async fetchServerMenus() {
      const { data } = await getSelfMenus()
      const menuMetas = {}
      const serverMenu = generateMenus(data, menuMetas)
      this.setInfo({
        serverMenu,
        menuMetas
      })
      return serverMenu
    },

    clearServerMenus() {
      this.serverMenu = undefined
    }
  }
})

export default useUserStore
