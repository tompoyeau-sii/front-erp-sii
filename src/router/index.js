import { authGuard } from '@/_helpers/auth-guard'
import Axios from '@/_services/caller.service'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FicheCollabSimuView from '../views/FicheCollabSimuView.vue';

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
    path: '/statistiques',
    name: 'ChartView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/ChartView.vue')
  },
  {
    path: '/collaborateurs/:id',
    name: 'FicheCollabView',
    component: () => import(/* webpackChunkName: "new" */ '../views/FicheCollabView.vue'),
    beforeEnter: (to, from, next) => {
      const isSimulation = localStorage.getItem('isSimulation') === 'true';
      if (isSimulation) {
        // Si la simulation est activée, redirige vers la vue de simulation
        authGuard(to, from, next); // Si authGuard est une fonction qui doit être appelée, assurez-vous de l'appeler ici.
        Axios.get(`/associate/${to.params.id}`)
        .then(response => {
            console.log("la")
            to.params.collab = response.data;
            next({ name: 'FicheCollabSimuView', params: { id: to.params.id } });
          })
          .catch(error => {
            console.error(error);
            router.push({ path: '/collaborateurs' });
          });
      } else {
        // Si la simulation n'est pas activée, poursuivre le traitement existant
        authGuard(to, from, next); // Si authGuard est une fonction qui doit être appelée, assurez-vous de l'appeler ici.
        Axios.get(`/associate/${to.params.id}`)
          .then(response => {
            to.params.collab = response.data;
            next();
          })
          .catch(error => {
            console.error(error);
            router.push({ path: '/collaborateurs' });
          });
      }
    }
  },
  {
    path: '/collaborateurs/:id/gestion',
    name: 'CollabGestionView',
    component: () => import(/* webpackChunkName: "new" */ '../views/CollabGestionView.vue'),
    // Before entering the route, fetch the client data from the API
    beforeEnter: (to, from, next) => {
      authGuard,
        Axios.get(`/associate/${to.params.id}/all`)
          .then(response => {
            // Pass the client data as a prop to the component
            to.params.collab = response.data
            next()
          })
          .catch(error => {
            console.error(error)
            router.push({ path: '/collaborateurs' })
          })
    }
  },
  {
    path: '/clients',
    name: 'ClientView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/ClientView.vue')
  },
  {
    path: '/clients/:id',
    name: 'FicheClientView',
    component: () => import(/* webpackChunkName: "new" */ '../views/FicheClientView.vue'),
    // Before entering the route, fetch the client data from the API
    beforeEnter: (to, from, next) => {
      authGuard,
        // Assuming you have an axios instance named `axios` for making API requests
        Axios.get(`/customer/${to.params.id}`)
          .then(response => {
            // Pass the client data as a prop to the component
            to.params.client = response.data
            next()
          })
          .catch(error => {
            console.error(error)
            router.push({ path: '/clients' })
          })
    }
  },
  {
    path: '/pdc',
    name: 'PdcView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/PdcView.vue')
  },
  {
    path: '/intercontrat',
    name: 'IntercontratView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/IntercontratView.vue')
  },
  {
    path: '/simulation',
    name: 'SimulationView',
    beforeEnter: authGuard,
    component: () => import(/* webpackChunkName: "new" */ '../views/SimulationView.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top:0 }
  }
})

export default router
