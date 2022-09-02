import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { DEFAULT_LAYOUT, LOGING_ROUTE_PATH } from './constants'
import setupUserLoginInfoGuard from './permission'
import { addRouteEmitter } from './route-listener'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: LOGING_ROUTE_PATH,
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },

    {
      path: '/',
      name: 'Home',
      component: DEFAULT_LAYOUT,
      children: [],
      meta: { title: '主页', affix: true }
    },

    {
      path: '/user',
      name: 'UserCenter',
      component: DEFAULT_LAYOUT,
      children: [],
      meta: { title: '用户中心' },
      children: [
        {
          path: 'info',
          name: 'UserInfo',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '用户信息' },
        },
      ]
    },

    {
      path: '/system',
      name: 'System',
      component: DEFAULT_LAYOUT,
      children: [
        {
          path: 'menu',
          name: 'Menu',
          component: () => import('@/views/system/menu/index.vue')
        },
        {
          path: 'dept',
          name: 'Dept',
          component: () => import('@/views/system/dept/index.vue')
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('@/views/system/user/index.vue')
        },
        {
          path: 'role',
          name: 'Role',
          component: () => import('@/views/system/role/index.vue')
        },
        {
          path: 'log',
          name: 'Log',
          component: () => import('@/views/system/log/index.vue')
        },
        {
          path: 'property',
          name: 'Property',
          component: () => import('@/views/system/property/index.vue')
        },
        {
          path: 'job',
          name: 'Job',
          component: () => import('@/views/system/job/index.vue')
        },
        {
          path: 'dict',
          name: 'Dict',
          component: () => import('@/views/system/dict/index.vue')
        },
        {
          path: 'message',
          name: 'Message',
          component: () => import('@/views/system/message/index.vue')
        }
      ]
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue')
    }
  ]
})

router.beforeEach(async (to) => {
  addRouteEmitter(to)
})

setupUserLoginInfoGuard(router)

export default router
