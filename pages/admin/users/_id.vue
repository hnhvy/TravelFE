<template>
  <div>
    <div>
      <breadcrumb heading="Users"></breadcrumb>
    </div>
    <div v-if="is_data_fetched">
      <b-row>
        <b-col xxs="12" lg="5" xl="4" class="col-left">
          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-img :src="stateUsers.user.avatar" fluid center />
              <div class="text-center pt-4">
                <p class="list-item-heading pt-2">
                  {{ stateUsers.user.fullName }}
                </p>
                <p class="mb-3 mt-3">
                  {{ stateUsers.user.bio }}
                </p>
                <b-button
                  size="sm"
                  variant="outline-main-color"
                  @click="fillDataFormEditUser(stateUsers.user.id)"
                >
                  <b-icon icon="pencil" aria-hidden="true"></b-icon> Edit
                  Profile
                </b-button>
              </div>
              <p class="text-muted text-small mb-2">
                Gender
              </p>
              <p class="mb-3">{{ stateUsers.user.gender }}</p>
              <p class="text-muted text-small mb-2">
                Birthday
              </p>
              <p class="mb-3">
                {{ moment(stateUsers.user.birthday).format('DD-MM-YYYY') }}
              </p>
              <p class="text-muted text-small mb-2">
                Email
              </p>
              <p class="mb-3">{{ stateUsers.user.email }}</p>
              <p class="text-muted text-small mb-2">
                Phone
              </p>
              <p class="mb-3">{{ stateUsers.user.phone }}</p>
              <p class="text-muted text-small mb-2">
                Status
              </p>
              <p class="mb-3">
                <b-badge
                  :variant="stateUsers.user.status"
                  class="mb-1 mr-1"
                  pill
                  >{{ stateUsers.user.status }}</b-badge
                >
              </p>
              <p class="text-muted text-small mb-2">Note</p>
              <p class="mb-3">{{ stateUsers.user.note }}</p>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col xxs="12" lg="7" xl="8" class="col-right">
          <b-card no-body>
            <b-card-body>
              <div class="pt-4">
                <p class="text-muted text-small mb-2">
                  Created At
                </p>
                <p class="mb-3">
                  {{ moment(stateUsers.user.createdAt).format('DD-MM-YYYY') }}
                </p>
                <p class="text-muted text-small mb-2">
                  Updated At
                </p>
                <p class="mb-3">
                  {{ moment(stateUsers.user.updatedAt).format('DD-MM-YYYY') }}
                </p>
              </div>
            </b-card-body>
          </b-card>
          <div class="separator mb-5" />
          <b-card no-body>
            <b-card-body>
              <div class="pt-4">
                <p class="list-item-heading pt-2">
                  {{ stateUsers.user.role.name }}
                </p>
                <p class="text-muted text-small mb-2">
                  Description
                </p>
                <p class="mb-3">{{ stateUsers.user.role.description }}</p>
                <p class="text-muted text-small mb-2">
                  Created At
                </p>
                <p class="mb-3">
                  {{
                    moment(stateUsers.user.role.createdAt).format('DD-MM-YYYY')
                  }}
                </p>
                <p class="text-muted text-small mb-2">
                  Updated At
                </p>
                <p class="mb-3">
                  {{
                    moment(stateUsers.user.role.updatedAt).format('DD-MM-YYYY')
                  }}
                </p>
                <p class="text-muted text-small mb-2">
                  Deleted At
                </p>
                <p class="mb-3">
                  {{
                    moment(stateUsers.user.role.deletedAt).format('DD-MM-YYYY')
                  }}
                </p>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <div>
        <b-modal
          ref="modal-edit"
          :title="`Edit User`"
          no-close-on-backdrop
          no-close-on-esc
          hide-footer
          scrollable
        >
          <FormEditUsers
            :user="stateUsers.user"
            :roles="stateRole.roles"
            :processing="processing"
            @hide-modal="hideModal"
            @submit-form-edit="submitFormEdit"
          ></FormEditUsers>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { Breadcrumb } from '@/components/common'
import { FormEditUsers } from '@/components/uncommon/Users'

import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  layout: 'admin',
  components: {
    Breadcrumb,
    FormEditUsers,
  },
  async fetch() {
    this.setUserQuery(this.$route.query)
    await this.fetchDataUser(this.$route.params.id)
    await this.fetchDataRoles()
    this.is_data_fetched = true
  },
  data() {
    return {
      moment,
      is_data_fetched: false,
      processing: false,
    }
  },
  computed: {
    ...mapState({
      stateUsers: (state) => state.users,
      stateRole: (state) => state.role,
    }),
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
  methods: {
    ...mapActions(['fetchDataUser', 'fetchDataRoles', 'editUser']),
    ...mapMutations({
      setUserQuery: 'SET_USER_QUERY',
    }),
    async submitFormEdit(form) {
      try {
        this.processing = true
        console.log('Edit user clicked - Edit User: ', form)
        await this.editUser(form)
        this.$fetch()
        this.$refs['modal-edit'].hide()
        this.$toast.success('Edit successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    fillDataFormEditUser(id) {
      this.$refs['modal-edit'].show()
    },
    hideModal() {
      this.$refs['modal-edit'].hide()
    },
  },
}
</script>

<style scoped></style>
