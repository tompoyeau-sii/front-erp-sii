import { createStore } from 'vuex'
import Axios from "@/_services/caller.service";
import { format } from "date-fns";

function todayDate() {
  return format(new Date(), "yyyy-MM-dd");
}
export default createStore({
  state: {
    connected: false,
    token: '',
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
      return state.test
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
      state.connected = state.connected; // Il semble y avoir une erreur ici, vous pouvez simplement utiliser : state.connected = true
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
    }
  },
  actions: {
    async initApp({ commit }) {
      try {
        commit('setLoading', true); // Définir isLoadingCustomers sur true au début du chargement

        // Chargement de tous les clients
        const customers = await Axios.get("/customers");
        commit('setCustomers', customers.data?.customer);

        //Chargements de tous les projets
        const projects = await Axios.get("/projects");
        commit('setProjects', projects.data?.project);

        // Chargement de tous les collaborateurs
        const allAssociates = await Axios.get("/associates/all");
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
    }
  },
  modules: {
  }
})
