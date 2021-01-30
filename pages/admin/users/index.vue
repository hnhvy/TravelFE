<template>
  <b-row>
    <b-col class="disable-text-selection">
      <b-row>
        <b-col xs="12">
          <breadcrumb heading="Users"></breadcrumb>
          <div class="top-right-button-container">
            <b-button
              v-b-modal.modalright
              variant="outline-main-color"
              size="lg"
              class="top-right-button"
            >
              <b-icon icon="file-person" aria-label="Add User"> </b-icon>
              NEW USER
            </b-button>
            <router-link :to="`users/deletedUsers`">
              <b-button
                variant="outline-danger"
                size="lg"
                class="top-right-button"
              >
                <b-icon icon="trash" aria-label="Deleted Users"> </b-icon>
                DELETED USERS
              </b-button>
            </router-link>
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
                <b-dropdown-item> Delete </b-dropdown-item>
              </b-dropdown>
            </b-button-group>
            <b-modal
              id="modalright"
              ref="modalright"
              :title="`Add New User`"
              modal-class="modal-right"
              hide-footer
            >
              <validation-observer v-slot="{ handleSubmit }">
                <b-form @submit.prevent="handleSubmit(submitFormAdd)">
                  <validation-provider
                    v-slot="validationContext"
                    name="E-mail"
                    :rules="{ required: true, email: true }"
                  >
                    <b-form-group :label="`Email`">
                      <b-form-input
                        v-model="newUser.email"
                        :state="
                          validationContext.errors[0]
                            ? false
                            : validationContext.valid
                            ? true
                            : null"
                      />
                      <b-form-invalid-feedback>{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                  <validation-provider
                    v-slot="validationContext"
                    name="Password"
                    :rules="{ required: true }"
                  >
                    <b-form-group :label="`Password`">
                      <b-form-input
                        v-model="newUser.password"
                        type="password"
                        :state="
                          validationContext.errors[0]
                            ? false
                            : validationContext.valid
                            ? true
                            : null"
                      />
                      <b-form-invalid-feedback>{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                  <b-form-group :label="`Gender`">
                    <v-select
                      v-model="newUser.gender"
                      :options="genderChoice"
                    />
                  </b-form-group>
                  <validation-provider
                    v-slot="validationContext"
                    name="Avatar"
                    :rules="{ required: true }"
                  >
                    <b-form-group :label="`Avatar`">
                      <b-form-file
                        v-model="file"
                        :state="
                          validationContext.errors[0]
                            ? false
                            : validationContext.valid
                            ? true
                            : null"
                        accept="image/*"
                        @change="handleChange"
                      ></b-form-file>
                    </b-form-group>
                    <b-form-invalid-feedback>{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </validation-provider>
                  <b-form-group :label="`Full Name`">
                    <b-form-input v-model="newUser.fullName" />
                  </b-form-group>
                  <b-form-group :label="`Birthday`">
                    <b-form-datepicker
                      v-model="value"
                      class="mb-2"
                      @context="onContext"
                    ></b-form-datepicker>
                  </b-form-group>
                  <b-form-group :label="`Phone number`">
                    <b-form-input v-model="newUser.phone" />
                  </b-form-group>
                  <b-form-group :label="`Role`">
                    <b-form-select v-model="newUser.roleId" class="mb-3">
                      <b-form-select-option
                        v-for="(role, index) in stateRole.roles"
                        :id="role.id"
                        :key="index"
                        :value="role.id"
                        >{{ role.name }}</b-form-select-option
                      >
                    </b-form-select>
                  </b-form-group>
                  <b-form-group :label="`Status`">
                    <b-form-radio-group
                      v-model="newUser.status"
                      stacked
                      class="pt-2"
                      :options="statuses"
                    />
                  </b-form-group>
                  <b-form-group :label="`Bio`">
                    <b-form-input v-model="newUser.bio" />
                  </b-form-group>
                  <b-form-group :label="`Note`">
                    <b-form-input v-model="newUser.note" />
                  </b-form-group>
                  <div class="float-right ml-2">
                    <b-button type="submit" size="lg" variant="main-color">
                      <span class="label">SUBMIT</span>
                    </b-button>
                    <div class="float-left mr-2">
                      <b-button
                        size="lg"
                        variant="main-color"
                        @click="hideModal('modalright')"
                      >
                        <span class="label">CANCEL</span>
                      </b-button>
                    </div>
                  </div>
                </b-form>
              </validation-observer>
            </b-modal>
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
                  <input
                    v-model="s"
                    :placeholder="`Search`"
                    @input="search(s)"
                  />
                </div>
              </div>
              <div class="float-md-right pt-1">
                <span class="text-muted text-small mr-1 mb-2">
                  {{ from }} - {{ to }} of {{ stateUsers.total }}</span
                >
                <b-dropdown
                  id="ddown2"
                  right
                  :text="`${stateUsers.query.limit}`"
                  variant="outline-dark"
                  class="d-inline-block"
                  size="xs"
                >
                  <b-dropdown-item
                    v-for="(size, index) in pageSizes"
                    :key="index"
                    @click="changePageSize(size)"
                    >{{ size }}</b-dropdown-item
                  >
                </b-dropdown>
              </div>
            </b-collapse>
          </div>
          <div class="separator mb-5" />
        </b-col>
      </b-row>
      <template>
        <b-row :key="componentKey">
          <b-col
            v-for="(user, index) in stateUsers.users"
            :id="user.id"
            :key="index"
            xs="12"
            class="mb-4"
          >
            <DataListUsers
              :key="user.id"
              v-contextmenu:contextmenu
              :data="user"
              :selected-user="stateUsers.selectedUser"
              :roles="stateRole.roles"
              :fetch="fetchData"
              @toggle-item="toggleItem"
            />
          </b-col>
        </b-row>
      </template>
      <b-pagination-nav
        v-model="stateUsers.query.page"
        :number-of-pages="stateUsers.pageCount"
        :per-page="stateUsers.query.limit"
        :link-gen="linkGen"
        align="center"
      >
        <template v-slot:next-text>
          <b-icon icon="chevron-right" />
        </template>
        <template v-slot:prev-text>
          <b-icon icon="chevron-left" />
        </template>
        <template v-slot:first-text>
          <b-icon icon="chevron-bar-left" />
        </template>
        <template v-slot:last-text>
          <b-icon icon="chevron-bar-right" />
        </template>
      </b-pagination-nav>
      <v-contextmenu ref="contextmenu" @contextmenu="handleContextmenu">
        <v-contextmenu-item @click="onContextCopy()">
          <b-icon scale="1" icon="file" />
          <span>Copy</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="onContextArchive()">
          <b-icon scale="1" icon="archive" />
          <span>Move to archive</span>
        </v-contextmenu-item>
        <v-contextmenu-item @click="onContextDelete()">
          <b-icon scale="1" icon="trash" />
          <span>Delete</span>
        </v-contextmenu-item>
      </v-contextmenu>
    </b-col>
  </b-row>
</template>

<script>
import { Breadcrumb } from '@/components/common'
import { DataListUsers } from '@/components/uncommon/Users'
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  components: {
    Breadcrumb,
    DataListUsers,
  },
  async fetch() {
    try {
      this.setUserQuery(this.$route.query)
      await this.fetchDataUsers()
      await this.fetchDataRoles()
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
          column: 'fullName,ASC',
          label: 'Name',
        },
        {
          column: 'gender,ASC',
          label: 'Gender',
        },
        {
          column: 'status,ASC',
          label: 'Status',
        },
      ],
      s: '',
      genderChoice: ['MALE', 'FEMALE'],
      statuses: ['ACTIVE', 'PENDING', 'INACTIVE'],
      pageSizes: [5, 10, 15],
      roleId: [],
      roleName: [],
      newUser: {
        email: '',
        password: '',
        fullName: '',
        birthday: '',
        gender: '',
        phone: '',
        roleId: 0,
        status: '',
      },
      moment,
      componentKey: 0,
      value: '',
      processing: false,
      file: null,
      imageUrl: '',
    }
  },
  layout: 'admin',
  computed: {
    ...mapState({
      stateUsers: (state) => state.users,
      stateRole: (state) => state.role,
    }),
    from() {
      return this.stateUsers.query.limit * (this.stateUsers.query.page - 1) + 1
    },
    to() {
      if (
        this.stateUsers.query.limit * (this.stateUsers.query.page - 1) +
          this.stateUsers.query.limit >
        this.stateUsers.total
      ) {
        return this.stateUsers.total
      } else {
        return (
          this.stateUsers.query.limit * (this.stateUsers.query.page - 1) +
          this.stateUsers.query.limit
        )
      }
    },
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
  mounted() {},
  methods: {
    ...mapActions([
      'fetchDataUsers',
      'fetchDataRoles',
      'setDataUserSelected',
      'addUser',
      'deleteUser',
      'editUser',
    ]),
    ...mapMutations({
      setUserQuery: 'SET_USER_QUERY',
    }),
    forceRerender() {
      console.log('Re-rendering')
      this.componentKey += 1
    },
    async submitFormAdd() {
      try {
        this.processing = true
        console.log('Add user clicked - Add User: ', this.newUser)
        await this.addUser(this.newUser)
        this.$fetch()
        this.hideModal('modalright')
        this.newUser = {
          email: '',
          password: '',
          fullName: '',
          birthday: '',
          gender: '',
          phone: '',
          roleId: 0,
          status: '',
          note: '',
          bio: '',
        }
        this.value = ''
        this.$toast.success('Add successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    async onContextDelete() {
      try {
        this.processing = true
        await this.deleteUser(this.stateUsers.selectedUser)
        this.stateUsers.selectedUser = []
        this.$fetch()
        this.$toast.success('Delete successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    selectAll(isToggle) {
      const usersForToggle = this.stateUsers.users
      if (this.stateUsers.selectedUser.length >= this.stateUsers.users.length) {
        if (isToggle)
          this.stateUsers.selectedUser.splice(
            0,
            this.stateUsers.selectedUser.length
          )
      } else {
        this.stateUsers.selectedUser.push(
          ...usersForToggle.map((user) => {
            return user.id
          })
        )
      }
    },
    isSelectedAll() {
      return this.stateUsers.selectedUser.length >= this.stateUsers.users.length
    },
    isAnyItemSelected() {
      return (
        this.stateUsers.selectedUser.length > 0 &&
        this.stateUsers.selectedUser.length < this.stateUsers.users.length
      )
    },
    keymap(event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.stateUsers.selectedUser.splice(
            0,
            this.stateUsers.selectedUser.length
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
      if (event.shiftKey && this.stateUsers.selectedUser.length > 0) {
        let usersForToggle = this.stateUsers.users
        const start = this.getIndex(userId, usersForToggle, 'id')
        const end = this.getIndex(
          this.stateUsers.selectedUser[this.stateUsers.selectedUser.length - 1],
          usersForToggle,
          'id'
        )
        usersForToggle = usersForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        )
        this.stateUsers.selectedUser.push(
          ...usersForToggle.map((user) => {
            return user.id
          })
        )
      } else if (this.stateUsers.selectedUser.includes(userId)) {
        this.stateUsers.selectedUser.splice(
          this.stateUsers.selectedUser.indexOf(userId),
          1
        )
      } else this.stateUsers.selectedUser.push(userId)
    },
    handleContextmenu(vnode) {
      if (!this.stateUsers.selectedUser.includes(vnode.key)) {
        this.stateUsers.selectedUser.splice(
          0,
          this.stateUsers.selectedUser.length
        )
        this.stateUsers.selectedUser.push(vnode.key)
      }
    },
    onContextCopy() {
      console.log(
        'context menu item clicked - Copy Items: ',
        this.stateUsers.selectedUser
      )
    },
    onContextArchive() {
      console.log(
        'context menu item clicked - Move to Archive Items: ',
        this.stateUsers.selectedUser
      )
    },
    async fetchData() {
      this.setUserQuery(this.$route.query)
      await this.fetchDataUsers()
      await this.fetchDataRoles()
    },
    hideModal(refname) {
      this.$refs[refname].hide()
    },
    onContext(ctx) {
      this.newUser.birthday = moment(ctx.selectedYMD, moment.ISO_8601)
    },
    changeOrderBy(sort) {
      this.sort = sort
      this.stateUsers.query.sort = sort.column
      this.$fetch()
    },
    async search(s) {
      this.stateUsers.query.s = '{"fullName":{"$cont": "' + s + '"}}'
      await this.fetchDataUsers()
    },
    changePageSize(perPage) {
      this.perPage = perPage
      this.stateUsers.query.limit = perPage
      this.$fetch()
    },
    linkGen(pageNum) {
      return {
        query: { page: pageNum },
      }
    },
    getBase64(img, callback) {
      const reader = new FileReader()
      reader.addEventListener('load', () => callback(reader.result))
      reader.readAsDataURL(img)
    },
    handleChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.getBase64(file, (imageUrl) => {
          this.imageUrl = imageUrl
          this.newUser.avatar = imageUrl
        })
      }
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
