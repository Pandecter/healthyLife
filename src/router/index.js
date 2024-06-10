import { createRouter, createWebHistory } from 'vue-router'
import PersonalPage from '../components/PersonInfo.vue'

const routes = [
  {
    path: '/',
    component: () => import('@/views/MainView.vue')
  },
  {
    path: '/person_info',
    component: PersonalPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
