import store from '@/store'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
console.log(
  !store().getters.currentUser.role.permissions.some(
    (item) => item.id === 1 || item.id === 2
  )
)
const data = [
  {
    header: true,
    title: 'User',
    hiddenOnCollapse: true,
  },
  {
    href: '/admin/role',
    title: 'Roles',
    icon: {
      element: 'b-icon',
      attributes: {
        scale: '0.8',
        icon: 'briefcase',
      },
    },
    hidden: !store().getters.currentUser.role.permissions.some(
      (item) => item.id === 1 || item.id === 2
    ),
  },
  {
    href: '/admin/users',
    title: 'Users',
    icon: {
      element: 'b-icon',
      attributes: {
        scale: '0.8',
        icon: 'person',
      },
    },
  },
  {
    href: '/admin/providers',
    title: 'Providers',
    icon: {
      element: 'b-icon',
      attributes: {
        scale: '0.8',
        icon: 'person',
      },
    },
  },
  {
    header: true,
    title: 'Service',
    hiddenOnCollapse: true,
  },
  {
    href: '/admin/destination',
    exactPath: true,
    title: 'Destinations',
    icon: {
      element: 'b-icon',
      attributes: {
        scale: '0.8',
        icon: 'cursor',
      },
    },
  },
  {
    href: '/admin/category',
    exactPath: true,
    title: 'Categories',
    icon: {
      element: 'b-icon',
      attributes: {
        scale: '0.8',
        icon: 'collection',
      },
    },
  },
  {
    href: '/admin/bill',
    exactPath: true,
    title: 'Bills',
    icon: {
      element: 'b-icon',
      attributes: {
        scale: '0.8',
        icon: 'newspaper',
      },
    },
  },
]
export default data