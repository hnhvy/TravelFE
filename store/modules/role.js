/* eslint-disable prettier/prettier */
export default {
    state: {
        roles: null,
        query: {
            page: 0,
            limit: 20,
        },
        total: 0,
        roleSelected: null,
    },

    mutations: {
        SET_ROLES(state, payload) {
            state.roles = payload
        },
        SET_ROLE_TOTAL(state, payload) {
            state.total = payload
        },
        SET_ROLE_QUERY(state, query) {
            state.query = {...state.query, ...query }
        },
        SET_ROLE_SELECTED(state, payload) {
            state.roleSelected = payload
        },
        SET_ROLE_DEFAULT(state) {
            state.roles = null
            state.page = 0
            state.limit = 10
            state.total = 0
            state.pageCount = 0
            state.roleSelected = null
        },
    },

    actions: {
        async fetchDataRoles({ commit, state }, payload) {
            try {
                const response = await this.$axios.get('/v1/roles', {
                    params: state.query,
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })

                if (response.status === 200) {
                    commit('SET_ROLES', response.data.data)
                    commit('SET_ROLE_TOTAL', response.data.total)
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },

        setDataRoleSelected({ commit, state }, payload) {
            const newData = state.roles.map((item) => ({...item }))
            const target = newData.filter((item) => payload === item.id)[0]
            commit('SET_ROLE_SELECTED', target)
        },

        async createRole(context, payload) {
            try {
                await this.$axios.post('/v1/roles', payload, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },

        async deleteRole(context, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.delete(`/v1/roles/${payload[i]}`, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },

        async updateRole({ state }, payload) {
            try {
                await this.$axios.patch(`/v1/roles/${state.roleSelected.id}`, payload, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
    },
}