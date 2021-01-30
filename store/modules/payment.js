export default {
  state: {
    payments: null,
    query: {
      page: 0,
      limit: 10,
      s: null,
      sort: null,
    },
    total: 0,
  },

  mutations: {
    SET_PAYMENTS(state, payload) {
      state.payments = payload
    },
    SET_PAYMENT_TOTAL(state, payload) {
      state.total = payload
    },
    SET_PAYMENT_QUERY(state, query) {
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
  },

  actions: {
    async fetchDataPayments({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/payments', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        commit('SET_PAYMENTS', response.data.data)
        commit('SET_PAYMENT_TOTAL', response.data.total)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async addPayment({ commit }, payload) {
      console.log(payload)
      try {
        const response = await this.$axios.post('/v1/payments', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        if (response.status === 200 || response.status === 201) {
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
