import axios from 'axios'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'ConnexionView',
    component: () => import(/* webpackChunkName: "new" */ '../views/ConnexionView.vue')
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
  },
  {
    path: '/clients/sncf',
    name: 'FicheClientView',
    component: () => import(/* webpackChunkName: "new" */ '../views/FicheClientView.vue')
  },
  // {
  //   path: '/clients/:label',
  //   name: 'FicheClientView',
  //   component: () => import(/* webpackChunkName: "new" */ '../views/FicheClientView.vue'),
  //   props: true,
  //   // Before entering the route, fetch the client data from the API
  //   beforeEnter: (to, from, next) => {
  //     // Assuming you have an axios instance named `axios` for making API requests
  //     axios.get(`http://localhost:8080/api/customer/${to.params.label}`)
  //       .then(response => {
  //         // Pass the client data as a prop to the component
  //         to.params.client = response.data
  //         console.log(response);
  //         // next()
  //       })
  //       .catch(error => {
  //         console.error(error)
  //         // next('/clients')
  //       })
  //   }
  // },
  {
    path: '/dashboard',
    name: 'HomeView',
    component: HomeView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
