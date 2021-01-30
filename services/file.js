export default function ({ $axios, $toast }, inject) {
  const fileApi = {
    put: (signedRequest, file) => {
      try {
        return $axios.put(signedRequest, file, {
          headers: {
            'Content-Type': file.type,
          },
        })
      } catch (e) {
        $toast.error('FILE_UPLOAD_FAILED')
      }
    },
    delete: (url, body) => {
      try {
        return $axios.delete(url, {
          headers: {
            authorization: 'Bearer ' + this.$cookies.get('token'),
          },
          data: body,
        })
      } catch (error) {
        $toast.error('FILE_DELETE_FAILED')
      }
    },
  }
  inject('fileApi', fileApi)
}
