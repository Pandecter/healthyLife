import { createRouter, createWebHistory } from 'vue-router'
import PersonalPage from '../components/PersonInfo.vue'
import StatsPage from '../components/PersonStats.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/views/MainView.vue')
  },
  {
    path: '/person_info',
    component: PersonalPage
  },
  {
    path: '/stats',
    component: StatsPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
