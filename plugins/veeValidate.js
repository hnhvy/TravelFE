/* eslint-disable import/namespace */
import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { messages } from 'vee-validate/dist/locale/en.json'
import * as rules from 'vee-validate/dist/rules'

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule],
    message: messages[rule],
  })
})

Vue.component('validationObserver', ValidationObserver)
Vue.component('validationProvider', ValidationProvider)
