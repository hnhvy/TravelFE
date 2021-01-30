/* eslint-disable prettier/prettier */
export default {
    state: {
        customers: null,
        customer: null,
        query: {
            page: 1,
            limit: 20,
            sort: 'fullName,ASC',
            s: null,
        },
        total: 0,
        count: 0,
        pageCount: 1,
        selectedCustomer: [],
        deletedCustomers: null,
        deletedSelectedCustomer: [],
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
        SET_PAGE_COUNT(state, payload) {
            state.pageCount = payload
        },
        SET_DELETED_CUSTOMERS(state, payload) {
            state.deletedCustomers = payload
        },
        SET_DELETED_SELECTED_CUSTOMER(state, payload) {
            state.deletedSelectedCustomer = payload
        },
        SET_CUSTOMER_QUERY(state, query) {
            state.query = {...state.query, ...query }
        },
        SET_CUSTOMER_SELECTED(state, payload) {
            state.selectedCustomer = payload
        },
        SET_CUSTOMER_DEFAULT(state) {
            state.customers = null
            state.page = 1
            state.limit = 20
            state.total = 0
            state.pageCount = 1
            state.selectedCustomer = null
        },
    },

    actions: {
        async fetchDataCustomers({ commit, state }) {
            try {
                const response = await this.$axios.get('/v1/customers', {
                    params: state.query,
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })

                if (response.status === 200) {
                    commit('SET_CUSTOMERS', response.data.data)
                    commit('SET_CUSTOMER_TOTAL', response.data.total)
                    commit('SET_PAGE_COUNT', response.data.pageCount)
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        setDataCustomerSelected({ commit, state }, payload) {
            const newData = state.customers.map((item) => ({...item }))
            const target = newData.filter((item) => payload === item.id)[0]
            commit('SET_CUSTOMER_SELECTED', target)
        },
        async addCustomer({ commit }, payload) {
            try {
                const response = await this.$axios.post('/v1/customers', payload, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })
                if (response.status === 200 || response.status === 201) {}
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async deleteCustomer(context, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.delete(`/v1/customers/${payload[i]}`, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async editCustomer({ commit }, payload) {

            try {
                const response = await this.$axios.patch(`/v1/customers/${payload.id}`, payload, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })
                if (response.status === 200 || response.status === 201) {}
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async fetchDeletedCustomers({ commit, state }) {
            try {
                const response = await this.$axios.get('/v1/customers/trashed', {
                    params: state.query,
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })

                if (response.status === 200) {
                    commit('SET_DELETED_CUSTOMERS', response.data.data)
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        setDeletedCustomerSelected({ commit, state }, payload) {
            const newData = state.deletedcustomers.map((item) => ({...item }))
            const target = newData.filter((item) => payload === item.id)[0]
            commit('SET_CUSTOMER_DELETED_SELECTED', target)
        },
        async restoreCustomer({ commit }, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.patch(`/v1/customers/${payload[i]}/restore`, payload, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async deleteCustomerPer({ commit }, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.delete(`/v1/customers/${payload[i]}/permanently`, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async fetchDataCustomer({ commit, state }, payload) {
            try {
                const response = await this.$axios.get(`/v1/customers/${payload}`, {
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