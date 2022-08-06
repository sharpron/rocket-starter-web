export const DEFAULT_LAYOUT = () => import('@/components/layout/index.vue')

export const LOGING_ROUTE_PATH = '/login'

import useUserStore from '../store/user'
export const meta = (route) => {
    const userStore = useUserStore()
    return userStore.appMenuMetas[route.fullPath]
}