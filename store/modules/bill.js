/* eslint-disable prettier/prettier */
export default {
  state: {
    bills: null,
    bill: null,
    query: {
			page: 1,
      limit: 10,
      filter: '',
			// sort: 'fullName,ASC',
			// s: null,
    },
    pageCount: 1,
    total: 0,
    count: 0,
    selectedBill: null,
    deletedBills: null,
		deletedSelectedBill: null,
  },

  mutations: {
    SET_BILLS(state, payload) {
      state.bills = payload
    },
    SET_BILL(state, payload) {
      state.bill = payload
    },
    SET_BILL_TOTAL(state, payload) {
      state.total = payload
    },
    SET_BILL_PAGE_COUNT(state, payload) {
      state.pageCount = payload
    },
    SET_DELETED_BILLS(state, payload) {
      state.deletedBills = payload
    },
    SET_DELETED_SELECTED_BILL(state, payload) {
      state.deletedSelectedBill = payload
    },
    SET_BILL_QUERY(state, query) {
      state.query = { ...state.query, ...query }
    },
    SET_BILL_SELECTED(state, payload) {
      state.selectedBill = payload
    },
    SET_BILL_DEFAULT(state) {
      state.bills = null
      state.page = 1
      state.limit = 10
      state.total = 0
      state.pageCount = 1
      state.selectedBill = null
    },
  },

  actions: {
    async fetchDataBills({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/bills', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_BILLS', response.data.data)
          commit('SET_BILL_TOTAL', response.data.total)
          commit('SET_BILL_PAGE_COUNT', response.data.pageCount)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    setDataBillSelected({ commit, state }, payload) {
      const newData = state.bills.map((item) => ({ ...item }))
      const target = newData.filter((item) => payload === item.id)[0]
      commit('SET_BILL_SELECTED', target)
    },
    async addBill({ commit }, payload) {
      try {
        const response = await this.$axios.post('/v1/bills', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        if (response.status === 200 || response.status === 201) {
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async deleteBill(context, payload) {
      try {
        await this.$axios.delete(`/v1/bills/${payload}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async editBill({ commit }, payload) {
      try {
        const response = await this.$axios.patch(
          `/v1/bills/${payload.id}`,
          payload,
          {
            headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
          }
        )
        if (response.status === 200 || response.status === 201) {
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async fetchDeletedBills({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/bills/trashed', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        if (response.status === 200) {
          commit('SET_DELETED_BILLS', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    setDeletedBillSelected({ commit, state }, payload) {
      const newData = state.deletedBills.map((item) => ({ ...item }))
      const target = newData.filter((item) => payload === item.id)[0]
      commit('SET_BILL_DELETED_SELECTED', target)
    },
    async fetchDataBill({ commit, state }, payload) {
      try {
        const response = await this.$axios.get(`/v1/bills/${payload}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_BILL', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
