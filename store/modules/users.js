/* eslint-disable prettier/prettier */
export default {
    state: {
        users: null,
        user: null,
        query: {
            page: 1,
            limit: 5,
            sort: 'fullName,ASC',
            s: null,
        },
        total: 0,
        count: 0,
        pageCount: 1,
        selectedUser: [],
        deletedUsers: null,
        deletedSelectedUser: [],
    },

    mutations: {
        SET_USERS(state, payload) {
            state.users = payload
        },
        SET_USER(state, payload) {
            state.user = payload
        },
        SET_USER_TOTAL(state, payload) {
            state.total = payload
        },
        SET_PAGE_COUNT(state, payload) {
            state.pageCount = payload
        },
        SET_DELETED_USERS(state, payload) {
            state.deletedUsers = payload
        },
        SET_DELETED_SELECTED_USER(state, payload) {
            state.deletedSelectedUser = payload
        },
        SET_USER_QUERY(state, query) {
            state.query = {...state.query, ...query }
        },
        SET_USER_SELECTED(state, payload) {
            state.selectedUser = payload
        },
        SET_USER_DEFAULT(state) {
            state.users = null
            state.page = 1
            state.limit = 5
            state.total = 0
            state.pageCount = 1
            state.selectedUser = null
        },
    },

    actions: {
        async fetchDataUsers({ commit, state }) {
            try {
                const response = await this.$axios.get('/v1/users', {
                    params: state.query,
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })

                if (response.status === 200) {
                    commit('SET_USERS', response.data.data)
                    commit('SET_USER_TOTAL', response.data.total)
                    commit('SET_PAGE_COUNT', response.data.pageCount)
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        setDataUserSelected({ commit, state }, payload) {
            const newData = state.users.map((item) => ({...item }))
            const target = newData.filter((item) => payload === item.id)[0]
            commit('SET_USER_SELECTED', target)
        },
        async addUser({ commit }, payload) {
            try {
                const response = await this.$axios.post('/v1/users', payload, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })
                if (response.status === 200 || response.status === 201) {}
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async deleteUser(context, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.delete(`/v1/users/${payload[i]}`, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async editUser({ commit }, payload) {

            try {
                const response = await this.$axios.patch(`/v1/users/${payload.id}`, payload, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })
                if (response.status === 200 || response.status === 201) {}
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async fetchDeletedUsers({ commit, state }) {
            try {
                const response = await this.$axios.get('/v1/users/trashed', {
                    params: state.query,
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })

                if (response.status === 200) {
                    commit('SET_DELETED_USERS', response.data.data)
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        setDeletedUserSelected({ commit, state }, payload) {
            const newData = state.deletedUsers.map((item) => ({...item }))
            const target = newData.filter((item) => payload === item.id)[0]
            commit('SET_USER_DELETED_SELECTED', target)
        },
        async restoreUser({ commit }, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.patch(`/v1/users/${payload[i]}/restore`, payload, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async deleteUserPer({ commit }, payload) {
            try {
                for (let i = 0; i < payload.length; i++) {
                    await this.$axios.delete(`/v1/users/${payload[i]}/permanently`, {
                        headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                    })
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
        async fetchDataUser({ commit, state }, payload) {
            try {
                const response = await this.$axios.get(`/v1/users/${payload}`, {
                    headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
                })

                if (response.status === 200) {
                    commit('SET_USER', response.data.data)
                }
            } catch (e) {
                throw e.response.data.message[0].description
            }
        },
    },
}