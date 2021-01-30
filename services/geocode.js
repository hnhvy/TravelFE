export default ({ $axios }, inject) => {
  const geoCodeApi = {
    get: async (address) => {
      try {
        const response = await $axios.get(
          'https://maps.googleapis.com/maps/api/geocode/json',
          {
            params: {
              address,
              key: process.env.KEY_GOOGLE_API,
            },
          }
        )
        const results = response.data?.results[0]
        if (results) {
          const indexCountry = results.address_components.findIndex(
            (item) => item.long_name === 'Việt Nam'
          )
          const cityName =
            results.address_components[indexCountry - 1].long_name
          const districtName =
            results.address_components[indexCountry - 2].long_name
          return {
            latitude: results.geometry.location.lat,
            longitude: results.geometry.location.lng,
            districtName,
            cityName,
          }
        }
      } catch (e) {
        throw e.response.data.message[0].description
      }
    },
  }
  inject('geoCodeApi', geoCodeApi)
}
