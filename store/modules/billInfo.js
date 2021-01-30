export default {
  state: {
    billInfos: null,
    query: {
      page: 0,
      limit: 10,
      s: null,
      sort: null,
      type: '',
    },
    total: 0,
  },

  mutations: {
    SET_BILL_INFOS(state, payload) {
      state.billInfos = payload
    },
    SET_BILL_INFO_TOTAL(state, payload) {
      state.total = payload
    },
    SET_BILL_INFO_QUERY(state, query) {
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
    async fetchDataBillInfos({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/billInfos', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        commit('SET_BILL_INFOS', response.data.data)
        commit('SET_BILL_INFO_TOTAL', response.data.total)
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async addBillInfo({ commit, state}, payload) {
      try {
        const response = await this.$axios.post('/v1/billInfos', payload, {
          params: state.query,
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
