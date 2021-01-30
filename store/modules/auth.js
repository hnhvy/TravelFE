export default {
  state: {
    currentUser:
      localStorage.getItem('user') != null
        ? JSON.parse(localStorage.getItem('user'))
        : null,
  },

  getters: {
    currentUser: (state) => state.currentUser,
  },

  mutations: {
    SET_USER(state, payload) {
      state.currentUser = payload
    },

    SET_LOGOUT(state) {
      state.currentUser = null
    },
  },

  actions: {
    async login(context, payload) {
      try {
        const response = await this.$axios.post('/v1/auth/login', payload)
        this.$cookies.set('token', response.data.data.token)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async getMe({ commit }) {
      try {
        const response = await this.$axios.get('/v1/auth/me', {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        localStorage.setItem('user', JSON.stringify(response.data.data))
        commit('SET_USER', response.data.data)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    logout({ commit, dispatch }) {
      localStorage.removeItem('user')
      this.$cookies.remove('token')
      commit('SET_ROLE_DEFAULT', { root: true })
      commit('SET_PERMISSION_DEFAULT', { root: true })
      commit('SET_LOGOUT')
    },
  },
}
