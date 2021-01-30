export default {
  state: {
    permissions: null,
  },

  mutations: {
    SET_PERMISSIONS(state, payload) {
      state.permissions = payload
    },
    SET_PERMISSION_DEFAULT(state) {
      state.permissions = null
    },
  },

  actions: {
    async fetchDataPermissions({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/permissions', {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        if (response.status === 200) {
          commit('SET_PERMISSIONS', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
