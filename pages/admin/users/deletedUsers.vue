<template>
  <b-row>
    <b-col class="disable-text-selection">
      <b-row>
        <b-col xs="12">
          <breadcrumb heading="Users"></breadcrumb>
          <div class="top-right-button-container">
            <b-button-group>
              <b-dropdown
                split
                right
                class="check-button"
                variant="outline-main-color"
                @click="selectAll(true)"
              >
                <label
                  slot="button-content"
                  class="custom-control custom-checkbox pl-4 mb-0 d-inline-block"
                >
                  <input
                    v-shortkey="{ select: ['ctrl', 'a'], undo: ['ctrl', 'd'] }"
                    class="custom-control-input"
                    type="checkbox"
                    :checked="isSelectedAll"
                    @shortkey="keymap"
                  />
                  <span
                    :class="{
                      'custom-control-label': true,
                      indeterminate: isAnyItemSelected,
                    }"
                    >&nbsp;</span
                  >
                </label>
                <b-dropdown-item> Delete permanently </b-dropdown-item>
                <b-dropdown-item> Restore </b-dropdown-item>
              </b-dropdown>
            </b-button-group>
          </div>
          <div class="mb-2 mt-2">
            <b-collapse id="displayOptions" class="d-md-block">
              <div class="d-block d-md-inline-block pt-1">
                <b-dropdown
                  id="ddown1"
                  :text="`${'Order by:'} ${sort.label}`"
                  variant="outline-dark"
                  class="mr-1 float-md-left btn-group"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(order, index) in sortOptions"
                    :key="index"
                    @click="changeOrderBy(order)"
                    >{{ order.label }}</b-dropdown-item
                  >
                </b-dropdown>

                <div
                  class="search-sm d-inline-block float-md-left mr-1 align-top"
                >
                  <b-input v-model="search" :placeholder="`Search`" />
                </div>
              </div>
            </b-collapse>
          </div>
          <div class="separator mb-5" />
        </b-col>
      </b-row>

      <template>
        <b-row>
          <b-col
            v-for="(user, index) in stateUsers.deletedUsers"
            :id="user.id"
            :key="index"
            xs="12"
            class="mb-4"
          >
            <DataListDeletedUsers
              :key="user.id"
              v-contextmenu:contextmenu
              :data="user"
              :selected-user="stateUsers.deletedSelectedUser"
              @toggle-item="toggleItem"
            />
          </b-col>
        </b-row>
      </template>
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
        <v-contextmenu-item @click="onContextDeletePer()">
          <b-icon scale="1" icon="file" />
          <span>Delete permanently</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="onContextRestore()">
          <b-icon scale="1" icon="archive" />
          <span>Restore</span>
        </v-contextmenu-item>
      </v-contextmenu>
    </b-col>
  </b-row>
</template>

<script>
import { Breadcrumb } from '@/components/common'
import { DataListDeletedUsers } from '@/components/uncommon/Users'

import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  components: {
    Breadcrumb,
    DataListDeletedUsers,
  },
  async fetch() {
    try {
      this.setUserQuery(this.$route.query)
      await this.fetchDeletedUsers()
    } catch (e) {
      this.$toast.error(e)
    }
  },
  data() {
    return {
      sort: {
        column: 'fullName',
        label: 'Name',
      },
      sortOptions: [
        {
          column: 'fullName',
          label: 'Name',
        },
        {
          column: 'role',
          label: 'Role',
        },
        {
          column: 'status',
          label: 'Status',
        },
      ],
      search: '',
      moment,
      value: '',
      processing: false,
    }
  },
  layout: 'admin',
  computed: {
    ...mapGetters({}),
    ...mapState({
      stateUsers: (state) => state.users,
    }),
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
  mounted() {},
  methods: {
    ...mapActions([
      'fetchDeletedUsers',
      'setDeletedUserSelected',
      'deleteUserPer',
      'restoreUser',
    ]),
    ...mapMutations({
      setUserQuery: 'SET_USER_QUERY',
    }),
    async onContextDeletePer() {
      try {
        this.processing = true
        await this.deleteUserPer(this.stateUsers.deletedSelectedUser)
        this.stateUsers.deletedSelectedUser = []
        this.$fetch()
        this.$toast('Deleted Permanently')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    async onContextRestore() {
      try {
        this.processing = true
        await this.restoreUser(this.stateUsers.deletedSelectedUser)
        this.stateUsers.deletedSelectedUser = []
        this.$fetch()
        this.$toast.success('Restored')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    selectAll(isToggle) {
      const usersForToggle = this.stateUsers.deletedUsers
      if (
        this.stateUsers.deletedSelectedUser.length >=
        this.stateUsers.users.length
      ) {
        if (isToggle)
          this.stateUsers.deletedSelectedUser.splice(
            0,
            this.stateUsers.deletedSelectedUser.length
          )
      } else {
        this.stateUsers.deletedSelectedUser.push(
          ...usersForToggle.map((user) => {
            return user.id
          })
        )
      }
    },
    isSelectedAll() {
      return (
        this.stateUsers.deletedSelectedUser.length >=
        this.stateUsers.deletedUsers.length
      )
    },
    isAnyItemSelected() {
      return (
        this.stateUsers.deletedSelectedUser.length > 0 &&
        this.stateUsers.deletedSelectedUser.length <
          this.stateUsers.deletedUsers.length
      )
    },
    keymap(event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.stateUsers.deletedSelectedUser.splice(
            0,
            this.stateUsers.deletedSelectedUser.length
          )
          break
      }
    },
    getIndex(value, arr, prop) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i
        }
      }
      return -1
    },
    toggleItem(event, userId) {
      if (event.shiftKey && this.stateUsers.deletedSelectedUser.length > 0) {
        let usersForToggle = this.stateUsers.users
        const start = this.getIndex(userId, usersForToggle, 'id')
        const end = this.getIndex(
          this.stateUsers.deletedSelectedUser[
            this.stateUsers.deletedSelectedUser.length - 1
          ],
          usersForToggle,
          'id'
        )
        usersForToggle = usersForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        )
        this.stateUsers.deletedSelectedUser.push(
          ...usersForToggle.map((user) => {
            return user.id
          })
        )
      } else if (this.stateUsers.deletedSelectedUser.includes(userId)) {
        this.stateUsers.deletedSelectedUser.splice(
          this.stateUsers.deletedSelectedUser.indexOf(userId),
          1
        )
      } else this.stateUsers.deletedSelectedUser.push(userId)
    },
    handleContextmenu(vnode) {
      if (!this.stateUsers.deletedSelectedUser.includes(vnode.key)) {
        this.stateUsers.deletedSelectedUser.splice(
          0,
          this.stateUsers.deletedSelectedUser.length
        )
        this.stateUsers.deletedSelectedUser.push(vnode.key)
      }
    },
    linkGen(pageNum) {
      return '#page-' + pageNum
    },
    changeOrderBy(sort) {
      this.sort = sort
    },
  },
}
</script>

<style scoped>
.col {
  flex-basis: auto;
  flex-grow: 1;
  max-width: 100%;
}
.v-contextmenu .v-contextmenu-item.v-contextmenu-item--hover {
  color: #212121;
  text-decoration: none;
  background-color: #46a0fc;
}
</style>
