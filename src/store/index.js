import { createStore } from 'vuex'

export default createStore({
  state: {
    connected: false,
    token: '',
  },
  getters: {
    getToken(state) {
      return state.test
    },
    
  },
  mutations: {
    isLog(state) {
      this.state.connected = state.connected
    }
  },
  actions: {
  },
  modules: {
  }
})
