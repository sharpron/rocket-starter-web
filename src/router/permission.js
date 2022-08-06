import NProgress from 'nprogress' // progress bar

import useUserStore from '@/store/user'
import { isAuthenticated } from '@/api/system/auth'

import { LOGING_ROUTE_PATH } from './constants'

const WHITE_LIST = [LOGING_ROUTE_PATH]

export default function setupUserLoginInfoGuard(router) {
  router.beforeEach(async (to, _from, next) => {
    NProgress.start()
    const userStore = useUserStore()
    async function isAuth() {
      if (userStore.userId) return true
      const { data } = await isAuthenticated()
      return data
    }
    if (await isAuth()) {
      // 检查权限，默认为undefined
      if (!userStore.perms) {
        await userStore.loadUserInfo()
      }
      // 检查菜单，默认为undefined

      if (!userStore.serverMenu) {
        await userStore.fetchServerMenus()
        // // trigger a redirection
        next({ ...to, replace: true })
      } else {
        next()
      }
    } else if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next({
        path: LOGING_ROUTE_PATH,
        query: {
          redirect: to.path,
          ...to.query
        }
      })
    }
    NProgress.done()
  })
}
