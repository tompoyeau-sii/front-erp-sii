import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/collaborateurs',
    name: 'CollabView',
    component: () => import(/* webpackChunkName: "new" */ '../views/CollabView.vue')
  },
  {
    path: '/clients',
    name: 'ClientView',
    component: () => import(/* webpackChunkName: "new" */ '../views/ClientView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
