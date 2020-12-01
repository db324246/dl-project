import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import AppLayout from '@/ProjectCommon/sysucAndBase/views/AppLayout'
/* Iframe */
import Iframe from '@/common/Iframe'

export const constantRouterMap = [
  {
    path: '/404',
    component: () => import('@/common/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/common/errorPage/401'),
    hidden: true
  },
  {
    path: '/svg-icon',
    component: () => import('@/common/svg-icons'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/home',
    component: AppLayout,
    name: '首页3',
    meta: {
      title: '首页3'
    },
    children: [
      {
        path: 'home',
        component: () => import('@pr/views/home'),
        name: '首页',
        meta: {
          title: '首页', icon: 'home_outline'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

// 异步路由
const asyncRouterMap = []

export { asyncRouterMap }

export default new Router({
  mode: 'history', // require service support
  base: '/<%= projectName %>/',
  // routes: constantRouterMap
  routes: constantRouterMap
})
