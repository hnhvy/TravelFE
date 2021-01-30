export default {
  state: {
    destinations: null,
    query: {
      page: 0,
      limit: 10,
      s: null,
      sort: null,
    },
    total: 0,
    destinationSelected: null,
  },

  mutations: {
    SET_DESTINATIONS(state, payload) {
      state.destinations = payload
    },
    SET_DESTINATION_TOTAL(state, payload) {
      state.total = payload
    },
    SET_DESTINATION_QUERY(state, query) {
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
    SET_DESTINATION_SELECTED(state, payload) {
      state.destinationSelected = payload
    },
    SET_DESTINATION_DEFAULT(state) {
      state.destinations = null
      state.destinationSelected = null
    },
  },

  actions: {
    async fetchDataDestinations({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/destinations', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        commit('SET_DESTINATIONS', response.data.data)
        commit('SET_DESTINATION_TOTAL', response.data.total)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    getDataDestinationSelected({ commit, state }, payload) {
      const newData = state.destinations.map((item) => ({ ...item }))
      const target = newData.filter((item) => payload === item.id)[0]
      commit('SET_DESTINATION_SELECTED', target)
    },

    async createDestination(context, payload) {
      try {
        await this.$axios.post('/v1/destinations', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async deleteDestination(context, payload) {
      try {
        await this.$axios.delete(`/v1/destinations/${payload}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async updateDestination({ state }, payload) {
      try {
        await this.$axios.patch(
          `/v1/destinations/${state.destinationSelected.id}`,
          payload,
          {
            headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
          }
        )
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
