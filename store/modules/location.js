export default {
  state: {},

  mutations: {},

  actions: {
    async getGeocoding({ commit }, payload) {
      try {
        const response = await this.$axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              key: "AIzaSyCv45asCJthye8h1mrrDxl66PBzUnBcbzA",
              address: payload.address,
            },
          }
        )
        return {
          latitude: response.data.results[0]?.geometry.location.lat,
          longitude: response.data.results[0]?.geometry.location.lng,
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
    

    async createLocation(context, payload) {
      try {
        const response = await this.$axios.post('/v1/locations', payload, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
        return { locationId: response.data.data.id }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async deleteLocation(context, payload) {
      try {
        await this.$axios.delete(`/v1/locations/${payload}`, {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        })
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },

    async updateLocation({ rootState }, payload) {
      try {
        const id = rootState.destination.destinationSelected.id
        console.log(id)
        const response = await this.$axios.patch(
          `/v1/locations/${id}`,
          payload,
          {
            headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
          }
        )
        return { locationId: response.data.data.id }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  },
}
