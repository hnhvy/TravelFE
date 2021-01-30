export default {
  state: {
    providers: null,
    provider: null,
    query: {
      page: 1,
      limit: 5,
      sort: 'name,ASC',
      s: null,
    },
    total: 0,
    count: 0,
    pageCount: 1,
    selectedProvider: [],
    deletedProviders: null,
    deletedSelectedProvider: [],
  },

  mutations: {
    SET_PROVIDERS(state, payload) {
      state.providers = payload
    },
    SET_PROVIDER(state, payload) {
      state.provider = payload
    },
    SET_PROVIDER_TOTAL(state, payload) {
      state.total = payload
    },
    SET_PAGE_COUNT(state, payload) {
      state.pageCount = payload
    },
    SET_DELETED_PROVIDERS(state, payload) {
      state.deletedProviders = payload
    },
    SET_DELETED_SELECTED_PROVIDER(state, payload) {
      state.deletedSelectedProvider = payload
    },
    SET_PROVIDER_QUERY(state, query) {
      state.query = { ...state.query, ...query }
      if (query.s) {
        state.query.s = `{"$or":[{"email":{"$contL":"${query.s}"}}]}`
      } else {
        state.query.s = null
      }
    },
    SET_PROVIDER_SELECTED(state, payload) {
      state.selectedProvider = payload
    },
    SET_PROVIDER_DEFAULT(state) {
      state.providers = null
      state.page = 1
      state.limit = 5
      state.total = 0
      state.pageCount = 1
      state.selectedProvider = null
    },
  },

  actions: {
    async fetchDataProviders({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/providers', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_PROVIDERS', response.data.data)
          commit('SET_PROVIDER_TOTAL', response.data.total)
          commit('SET_PAGE_COUNT', response.data.pageCount)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    setDataProviderSelected({ commit, state }, payload) {
      const newData = state.providers.map((item) => ({ ...item }))
      const target = newData.filter((item) => payload === item.id)[0]
      commit('SET_PROVIDER_SELECTED', target)
    },
    async addProvider({ commit }, payload) {
      try {
        const response = await this.$axios.post('/v1/providers', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        if (response.status === 200 || response.status === 201) {
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async deleteProvider(context, payload) {
      try {
        for (let i = 0; i < payload.length; i++) {
          await this.$axios.delete(`/v1/providers/${payload[i]}`, {
            headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
          })
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async editProvider({ commit }, payload) {
      try {
        const response = await this.$axios.patch(
          `/v1/providers/${payload.id}`,
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
    async fetchDeletedProviders({ commit, state }) {
      try {
        const response = await this.$axios.get('/v1/providers/trashed', {
          params: state.query,
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_DELETED_PROVIDERS', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    setDeletedProviderSelected({ commit, state }, payload) {
      const newData = state.deletedProviders.map((item) => ({ ...item }))
      const target = newData.filter((item) => payload === item.id)[0]
      commit('SET_PROVIDER_DELETED_SELECTED', target)
    },
    async restoreProvider({ commit }, payload) {
      try {
        for (let i = 0; i < payload.length; i++) {
          await this.$axios.patch(
            `/v1/providers/${payload[i]}/restore`,
            payload,
            {
              headers: {
                authorization: 'Bearer ' + this.$cookies.get('token'),
              },
            }
          )
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async deleteProviderPer({ commit }, payload) {
      try {
        for (let i = 0; i < payload.length; i++) {
          await this.$axios.delete(`/v1/providers/${payload[i]}/permanently`, {
            headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
          })
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    async fetchDataProvider({ commit, state }, payload) {
      try {
        const response = await this.$axios.get(`/v1/providers/${payload}`, {
          params: { join: 'billInfos' },
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })

        if (response.status === 200) {
          commit('SET_PROVIDER', response.data.data)
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
