export default {
  state: {
    categories: null,
  },

  mutations: {
    SET_CATEGORIES(state, payload) {
      state.categories = payload
    },
  },

  actions: {
    async fetchDataCategories({ commit }) {
      try {
        const response = await this.$axios.get('/v1/service_categories/trees', {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        commit('SET_CATEGORIES', response.data.data)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async addCategory(context, payload) {
      try {
        console.log(payload)
        await this.$axios.post('/v1/service_categories', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async updateCategory(context, { id, payload }) {
      try {
        await this.$axios.patch(`/v1/service_categories/${id}`, payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async deleteCategory(context, id) {
      try {
        await this.$axios.delete(`/v1/service_categories/${id}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
