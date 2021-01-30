<template>
  <div>
    <SidebarMenu
      :menu="menuItems"
      theme="white-theme"
      width="320px"
      :hide-toggle="true"
    >
      <span slot="toggle-icon">
        <b-icon icon="arrow-left-right" scale="1.4"></b-icon>
      </span>
    </SidebarMenu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
export default {
  components: {
    SidebarMenu,
  },
  data() {
    return {
      menuItems: [
        {
          header: true,
          title: 'User',
          hiddenOnCollapse: true,
        },
        {
          href: '/admin/customers',
          exactPath: true,
          title: 'Customers',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.8',
              icon: 'collection',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'CUSTOMER_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/roles',
          title: 'Roles',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'briefcase',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'ROLE_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/users',
          title: 'Users',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'person',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'USER_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/providers',
          title: 'Providers',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'people',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'PROVIDER_READ' || item.name === 'ALL'
          ),
        },
        {
          header: true,
          title: 'Service',
          hiddenOnCollapse: true,
        },
        {
          href: '/admin/categories',
          exactPath: true,
          title: 'Categories',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'collection',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) =>
              item.name === 'SERVICE_CATEGORY_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/destinations',
          exactPath: true,
          title: 'Destinations',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'cursor',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'DESTINATION_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/bills',
          exactPath: true,
          title: 'Bills',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'newspaper',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'BILL_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/services',
          exactPath: true,
          title: 'Services',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'grid',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'SERVICE_READ' || item.name === 'ALL'
          ),
        },
        {
          href: '/admin/payments',
          exactPath: true,
          title: 'Payments',
          icon: {
            element: 'b-icon',
            attributes: {
              scale: '0.6',
              icon: 'card-list',
            },
          },
          hidden: !this.$store.state.auth.currentUser.role.permissions.some(
            (item) => item.name === 'PAYMENTS_READ' || item.name === 'ALL'
          ),
        },
      ],
    }
  },
  computed: {
    ...mapState({
      stateUser: (state) => state.user,
    }),
  },
}
</script>
