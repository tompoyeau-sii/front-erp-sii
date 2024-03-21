import { createStore } from 'vuex'
import Axios from "@/_services/caller.service";
import { format } from "date-fns";

function todayDate() {
  return format(new Date(), "yyyy-MM-dd");
}
export default createStore({
  state: {
    connected: false,
    refYear:'',
    userName: '',
    userId: '',
    token: null,
    allAssociates: '',
    customers: '',
    projects: '',
    managers: '',
    graduations: '',
    jobs: '',
    genders: '',
    simulationMode: false,
    isLoading: false // Nouvel état pour gérer le chargement des clients
  },
  getters: {
    getToken(state) {
      return state.token
    },
    getRefYear(state) {
      return state.refYear;
    },
    getCustomers(state) {
      return state.customers;
    },
    getAllAssociates(state) {
      return state.allAssociates;
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
    getGenders(state) {
      return state.genders;
    },
    getSimulationMode(state) {
      return state.simulationMode;
    },
    isLoading(state) {
      return state.isLoading;
    },
    getUserName(state) {
      return state.userName;
    },
    getUserId(state) {
      return state.userId;
    }
  },
  mutations: {
    isLog(state) {
      state.connected = state.connected;
    },
    setRefYear(state, data) {
      state.refYear = data;
    },
    setCustomers(state, data) {
      state.customers = data;
    },
    setAllAssociates(state, data) {
      state.allAssociates = data;
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
    setGenders(state, data) {
      state.genders = data;
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
    setUserName(state, userName) {
      state.userName = userName;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
  },
  actions: {
    async initApp({ commit }) {
      try {
        commit('setLoading', true);

        //Chargement de l'année de référence
        const refYear = await Axios.get("pdc/year")
        commit('setRefYear', refYear.data?.pdc.actual_year);

        // Chargement de tous les clients
        const customers = await Axios.get("/statistiques/customer/actualMonth", {
          params: {
            year: refYear.data?.pdc.actual_year,
          },
        });
        commit('setCustomers', customers.data?.caOfActualMonthCustomer);

        //Chargements de tous les projets
        const projects = await Axios.get("/projects");
        commit('setProjects', projects.data?.project);

        // Chargement de tous les collaborateurs
        const allAssociates = await Axios.get("/associates/all");
        commit('setAllAssociates', allAssociates.data?.associate);

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

        // Chargement de tous les jobs
        const jobs = await Axios.get("/jobs")
        commit('setJobs', jobs.data?.job);

        // Chargement de tous les Genres
        const genders = await Axios.get("/genders")
        commit('setGenders', genders.data?.gender);

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
    async refreshRefYear({ commit }) {
      try {

        const refYear = await Axios.get("pdc/year")
        commit('setRefYear', refYear.data?.pdc.actual_year);

        // Fin du chargement
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement de l'année de référence:", error);
      }
    },
    async refreshCustomers({ commit }) {
      try {

        // Actualiser les clients
        const customers = await Axios.get("/statistiques/customer/actualMonth");
        commit('setCustomers', customers.data?.caOfActualMonthCustomer);

        // Fin du chargement
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement des clients:", error);
      }
    },
    async refreshJobs({ commit }) {
      try {

        // Actualiser les clients
        const jobs = await Axios.get("/jobs");
        commit('setJobs', jobs.data?.job);

        // Fin du chargement
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement des jobs:", error);
      } finally {
        commit('setLoading', false);
      }
    },
    async refreshGraduations({ commit }) {
      try {

        // Actualiser les clients
        const graduations = await Axios.get("/graduations");
        commit('setGraduations', graduations.data?.graduation);

        // Fin du chargement
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement des diplôme:", error);
      } finally {
        commit('setLoading', false);
      }
    },
    async refreshGenders({ commit }) {
      try {

        // Actualiser les clients
        const genders = await Axios.get("/genders");
        commit('setGenders', genders.data?.gender);

        // Fin du chargement
      } catch (error) {
        // Gérer les erreurs si nécessaire
        console.error("Erreur lors du chargement des genres:", error);
      } finally {
        commit('setLoading', false);
      }
    },
  },
})
