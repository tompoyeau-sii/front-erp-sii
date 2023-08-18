import { createStore } from 'vuex'
import Axios from "@/_services/caller.service";

export default createStore({
  state: {
    connected: false,
    token: '',
    associates: '',
    customers: '',
    isLoading: false // Nouvel état pour gérer le chargement des clients
  },
  getters: {
    getToken(state) {
      return state.test
    },
    getCustomers(state) {
      return state.customers;
    },
    isLoading(state) {
      return state.isLoading;
    }
  },
  mutations: {
    isLog(state) {
      state.connected = state.connected; // Il semble y avoir une erreur ici, vous pouvez simplement utiliser : state.connected = true
    },
    setCustomers(state, data) {
      state.customers = data;
    },
    setCustomers(state, data) {
      state.customers = data;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    }
  },
  actions: {
    async initApp({ commit }) {
      try {
        commit('setLoading', true); // Définir isLoadingCustomers sur true au début du chargement
        const customers = await Axios.get("/customers");
        commit('setCustomers', customers.data?.customer);
        const allAssociates = await Axios.get("/associates/pdc");
        commit('setAssociates', allAssociates.data?.associate);
        
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement des clients:", error);
      } finally {
        commit('setLoading', false); // Définir isLoadingCustomers sur false une fois le chargement terminé
      }
    }
  },
  modules: {
  }
})
