import { createStore } from 'vuex'
import Axios from "@/_services/caller.service";
import { format } from "date-fns";

function todayDate() {
  return format(new Date(), "yyyy-MM-dd");
}
export default createStore({
  state: {
    connected: false,
    token: null,
    associates: '',
    customers: '',
    projects: '',
    managers: '',
    graduations: '',
    jobs: '',
    simulationMode: false,
    isLoading: false // Nouvel état pour gérer le chargement des clients
  },
  getters: {
    getToken(state) {
      return state.token
    },
    getCustomers(state) {
      return state.customers;
    },
    getAssociates(state) {
      return state.associates;
    },
    getProjects(state) {
      return state.projects;
    },
    getManagers(state) {
      return state.managers;
    },
    getGraduations(state) {
      return state.graduations;
    },
    getJobs(state) {
      return state.jobs;
    },
    getSimulationMode(state) {
      return state.simulationMode;
    },
    isLoading(state) {
      return state.isLoading;
    }
  },
  mutations: {
    isLog(state) {
      state.connected = state.connected;
    },
    setCustomers(state, data) {
      state.customers = data;
    },
    setAssociates(state, data) {
      state.associates = data;
    },
    setProjects(state, data) {
      state.projects = data;
    },
    setManagers(state, data) {
      state.managers = data;
    },
    setGraduations(state, data) {
      state.graduations = data;
    },
    setJobs(state, data) {
      state.jobs = data;
    },
    setSimulationMode(state, data) {
      state.simulationMode = data;
    },
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    async initApp({ commit }) {
      try {
        commit('setLoading', true);

        // Chargement de tous les clients
        const customers = await Axios.get("/customers");
        commit('setCustomers', customers.data?.customer);

        //Chargements de tous les projets
        const projects = await Axios.get("/projects");
        commit('setProjects', projects.data?.project);

        // Chargement de tous les collaborateurs
        const allAssociates = await Axios.get("/associates");
        commit('setAssociates', allAssociates.data?.associate);

        //Chargement de tous les managers
        let managers= []
        await Axios.get("/associates/managers").then((res) => {
          res.data?.manager.forEach((job) => {
            job.Associates.forEach((manager) => {
              if (
                manager.Associate_Job.start_date < todayDate() &&
                manager.Associate_Job.end_date > todayDate()
                ) {
                manager.full_name = manager.first_name + " " + manager.name;
                managers.push(manager);
              }
            });
          });
        });
        commit('setManagers', managers);
        console.log(managers)

        // Chargement de tous les jobs
        const jobs = await Axios.get("/jobs")
        commit('setJobs', jobs.data?.job);

        // Chargement de tous les dilplome
        const graduations = await Axios.get("/graduations")
        commit('setGraduations', graduations.data?.graduation);
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        commit('setLoading', false); // Définir isLoadingCustomers sur false une fois le chargement terminé
      }
    },
  },
  modules: {
  }
})
