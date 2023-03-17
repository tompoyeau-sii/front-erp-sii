import { authGuard } from '@/_helpers/auth-guard'
import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// localStorage.setItem('token', 'token')

const routes = [
  {
    path: '/',
    name: 'ConnexionView',
    component: () => import(/* webpackChunkName: "new" */ '../views/ConnexionView.vue'),
  },
  {
    path: '/dashboard',
    name: 'HomeView',
    component: HomeView,
    beforeEnter: authGuard
  },
  {
    path: '/parametres',
    name: 'ParametreView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/ParametreView.vue')
  },
  {
    path: '/collaborateurs',
    name: 'CollabView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/CollabView.vue')
  },
  {
    path: '/collaborateurs/:id',
    name: 'FicheCollabView',
    component: () => import(/* webpackChunkName: "new" */ '../views/FicheCollabView.vue'),
    // Before entering the route, fetch the client data from the API
    beforeEnter: (to) => {
      authGuard,
        axios.get(`http://localhost:8080/api/associate/${to.params.id}`)
          .then(response => {
            // Pass the client data as a prop to the component
            to.params.collab = response.data
            console.log(response);
          })
          .catch(error => {
            console.error(error)
            router.push({ path: '/collaborateurs' })
            // next('/clients')
          })
    }
  },
  {
    path: '/clients',
    name: 'ClientView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/ClientView.vue')
  },
  // {
  //   path: '/clients/sncf',
  //   name: 'FicheClientView',
  //   beforeEnter: authGuard,
  //   component: () => import(/* webpackChunkName: "new" */ '../views/FicheClientView.vue')
  // },
  {
    path: '/clients/:label',
    name: 'FicheClientView',
    component: () => import(/* webpackChunkName: "new" */ '../views/FicheClientView.vue'),
    // Before entering the route, fetch the client data from the API
    beforeEnter: (to) => {
      authGuard,
        // Assuming you have an axios instance named `axios` for making API requests
        axios.get(`http://localhost:8080/api/customer/${to.params.label}`)
          .then(response => {
            // Pass the client data as a prop to the component
            to.params.client = response.data
            // $store.getters
            console.log(response);
            // next()
          })
          .catch(error => {
            console.error(error)
            router.push({ path: '/clients' })
            // next('/clients')
          })
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
