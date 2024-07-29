import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/MainView.vue')
  },
  {
    path: '/person_info',
    component: () => import('@/components/pages/PersonInfo.vue')
  },
  {
    path: '/stats',
    component: () => import('@/components/pages/PersonStats.vue')
  },
  {
    path: '/base',
    component: () => import('@/components/pages/ProductBase.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
