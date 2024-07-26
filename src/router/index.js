import { createRouter, createWebHistory } from 'vue-router'
//import PersonalPage from '../components/PersonInfo.vue'
//import StatsPage from '../components/PersonStats.vue'
//import ProductPage from '../components/ProductBase.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/views/MainView.vue')
  },
  {
    path: '/person_info',
    component: () => import('@/components/PersonInfo.vue')
  },
  {
    path: '/stats',
    component: () => import('@/components/PersonStats.vue')
  },
  {
    path: '/base',
    component: () => import('@/components/ProductBase.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
