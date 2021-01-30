<template>
  <div>
    <nav class="navbar fixed-top">
      <div class="d-flex align-items-center navbar-left">
        <b-icon
          icon="list"
          font-scale="1.5"
          class="menu-button d-none d-md-block"
        ></b-icon>
      </div>
      <router-link class="navbar-logo" tag="a" to="/app">
        <span class="logo d-none d-sm-block"></span>
        <span class="logo-mobile d-block d-sm-none"></span>
      </router-link>

      <div class="navbar-right">
        <div class="user d-inline-block">
          <b-dropdown
            class="dropdown-menu-right"
            right
            variant="empty"
            toggle-class="p-0"
            menu-class="mt-3"
            no-caret
          >
            <template slot="button-content">
              <span class="name mr-1">{{ currentUser.fullName }}</span>
              <span>
                <img :alt="currentUser.title" :src="currentUser.avatar" />
              </span>
            </template>
            <b-dropdown-item @click="signOut">Sign out</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      searchKeyword: '',
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  methods: {
    ...mapActions(['logout']),
    searchClick() {},
    signOut() {
      this.logout()
      this.$router.push('/admin/login')
    },
  },
}
</script>
