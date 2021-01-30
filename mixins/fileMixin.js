const Jimp = require('jimp')
const slug = require('slug')
const moment = require('moment')
const XLSX = require('xlsx')
// Specially made for Element UI image uploader
export default {
  methods: {
    // Work flow:
    // Get pre-signed url
    // Process files (resize, adjust,...)
    // Send raw file to server
    /// ////////////////////////////////////
    // Process images
    // Save new adjusted fileList
    // let urls = this.getSignedUrlS3(files)
    // loop through fileList and send them each time loop
    /// ////////////////////////////////////
    // Keep getSignedUrlS3 and upload files seperate because:
    // we can get multiple urls
    // but can only upload 1 file at a time (pre-signed url limitation)
    async getSignedUrlS3(file, folderPrefix = 'UNCATEGORIZED_FILES') {
      const data = {
        fileName: file.name,
        type: file.type,
        folderPrefix,
      }
      const response = await this.$axios.post(
        '/v1/medias/presigned-url',
        data,
        {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        }
      )
      return response.data.data.url
    },
    async uploadFileToS3(file, folderPrefix) {
      const url = await this.getSignedUrlS3(file, folderPrefix)
      const response = await this.$fileApi.put(url, file)
      if (response.status === 200) {
        // const questionIndex = response.config.url.indexOf('?')
        // const responseUrl = response.config.url.substring(0, questionIndex)
        const responseUrl = response.config.url
        return responseUrl
      }
    },
    async getSignedUrlsS3(files, folderPrefix = 'UNCATEGORIZED_FILES') {
      files = await files.map((file) => {
        // const fileName = this.getUniqueFileName(file)
        return {
          fileName: file.name,
          // Get the file's extension
          type: file.type,
          folderPrefix,
        }
      })
      const response = await this.$axios.post(
        '/v1/medias/presigned-url/bulk',
        files,
        {
          headers: { authorization: 'Bearer ' + this.$cookies.get('token') },
        }
      )
      return response.data.data
    },
    // Has to have .raw (Element UI uploader's format)
    async uploadFilesToS3(files, folderPrefix) {
      const urls = await this.getSignedUrlsS3(files, folderPrefix)
      const responseUrls = await Promise.all(
        urls.map(async (item, index) => {
          const response = await this.$axios.put(
            item.presignedUrl,
            files[index]
          )
          if (response.status === 200) {
            const questionIndex = response.config.url.indexOf('?')
            const responseUrl = response.config.url.substring(0, questionIndex)
            return responseUrl
          }
          this.$toast.error('Failed to upload image')
        })
      )
      return responseUrls
    },

    base64ToFile(base64String, fileName) {
      const arr = base64String.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], fileName, {
        type: mime,
      })
    },
    sheetFileToJSON(file) {
      return new Promise((resolve, reject) => {
        const f = file
        const reader = new FileReader()
        reader.onload = function (e) {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const json = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          )
          resolve(json)
        }
        reader.readAsArrayBuffer(f)
      })
    },
    // Image only
    async resize(path, width) {
      // Read the image from the blob path (blob:http://....)
      const image = await Jimp.read(path)
      await image.resize(width, Jimp.AUTO)
      // Convert to base64 string
      const base64String = await image.getBase64Async(image.getMIME())
      return this.base64ToFile(
        base64String,
        slug(moment().format()) + '-' + width
      )
    },
  },
}
