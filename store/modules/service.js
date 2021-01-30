export default {
  state: {
    services: null,
    service: null,
    query: {
      page: 0,
      limit: 10,
      s: null,
      sort: null,
    },
    total: 0,
    pageCount: 0,
    serviceSelected: null,
  },

  mutations: {
    SET_SERVICES(state, payload) {
      state.services = payload
    },
    SET_SERVICE(state, payload) {
      state.service = payload
    },
    SET_SERVICE_TOTAL(state, payload) {
      state.total = payload
    },
    SET_SERVICE_PAGE_COUNT(state, payload) {
      state.pageCount = payload
    },
    SET_SERVICE_QUERY(state, query) {
      state.query = { ...state.query, ...{ limit: 10, page: query.page } }
      if (query.s && query.q) {
        state.query.s = `{"$or":[{"${query.s}":{"$contL":"${query.q}"}}]}`
      } else {
        state.query.s = null
      }
      if (query.sort) {
        state.query.sort = query.sort
      }
    },
    SET_SERVICE_SELECTED(state, payload) {
      state.serviceSelected = payload
    },
  },

  actions: {
    async fetchDataServices({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/services', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        commit('SET_SERVICES', response.data.data)
        commit('SET_SERVICE_TOTAL', response.data.total)
        commit('SET_SERVICE_PAGE_COUNT', response.data.pageCount)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    getDataServiceSelected({ commit, state }, payload) {
      const newData = state.services.map((item) => ({ ...item }))
      const target = newData.filter((item) => payload === item.id)[0]
      commit('SET_SERVICE_SELECTED', target)
    },

    async createService(context, payload) {
      try {
        await this.$axios.post('/v1/services', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async deleteService(context, payload) {
      try {
        await this.$axios.delete(`/v1/services/${payload}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async updateService({ state }, payload) {
      try {
        await this.$axios.patch(
          `/v1/services/${state.serviceSelected.id}`,
          payload,
          {
            headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
          }
        )
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async fetchDataService({ commit, state }, payload) {
      try {
        const response = await this.$axios.get(`/v1/services/${payload}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_SERVICE', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
