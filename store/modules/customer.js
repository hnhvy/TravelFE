export default {
  state: {
    customers: null,
    customer: null,
    query: {
      page: 0,
      limit: 10,
      s: null,
      sort: null,
    },
    total: 0,
    pageCount: 0
  },

  mutations: {
    SET_CUSTOMERS(state, payload) {
      state.customers = payload
    },
    SET_CUSTOMER(state, payload) {
      state.customer = payload
    },
    SET_CUSTOMER_TOTAL(state, payload) {
      state.total = payload
    },
    SET_CUSTOMER_PAGE_COUNT(state, payload) {
      state.pageCount = payload
    },
    SET_CUSTOMER_QUERY(state, query) {
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
    async fetchDataCustomers({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/customers', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        commit('SET_CUSTOMERS', response.data.data)
        commit('SET_CUSTOMER_TOTAL', response.data.total)
        commit('SET_CUSTOMER_PAGE_COUNT', response.data.pageCount)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async fetchDataCustomer({ commit, state }, payload) {
      try {
        const response = await this.$axios.get(`/v1/customers/${payload}`, {
          params: { join: 'billInfos' },
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_CUSTOMER', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
