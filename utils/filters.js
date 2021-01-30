import Vue from 'vue'
import moment from 'moment'
import sanitizeHtml from 'sanitize-html'

Vue.filter('formatDate', (val) => {
  return moment(val).format('YYYY-MM-DD')
})

Vue.filter('sanitize', (val) => {
  return sanitizeHtml(val)
})
