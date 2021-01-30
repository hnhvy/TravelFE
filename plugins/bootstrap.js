/* eslint-disable prettier/prettier */
import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.use(BootstrapVue, {
    BBadge: { variant: ['ACTIVE', 'INACTIVE', 'PENDING'] },
})
Vue.use(IconsPlugin)