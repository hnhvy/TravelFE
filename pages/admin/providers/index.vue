<template>
  <b-row>
    <b-col class="disable-text-selection">
      <b-row>
        <b-col xs="12">
          <breadcrumb heading="Providers"></breadcrumb>
          <div class="top-right-button-container">
            <b-button
              v-b-modal.modalright
              variant="outline-main-color"
              size="lg"
              class="top-right-button"
            >
              <b-icon icon="file-person" aria-label="Add Provider"> </b-icon>
              NEW PROVIDER
            </b-button>
            <router-link :to="`providers/deletedProviders`">
              <b-button
                variant="outline-danger"
                size="lg"
                class="top-right-button"
              >
                <b-icon icon="trash" aria-label="Deleted Providers"> </b-icon>
                DELETED PROVIDERS
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
              :title="`Add New Provider`"
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
                        v-model="newProvider.email"
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
                      v-model="newProvider.gender"
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
                    <b-form-input v-model="newProvider.name" />
                  </b-form-group>
                  <b-form-group :label="`Birthday`">
                    <b-form-datepicker
                      v-model="value"
                      class="mb-2"
                      @context="onContext"
                    ></b-form-datepicker>
                  </b-form-group>
                  <b-form-group :label="`Phone number`">
                    <b-form-input v-model="newProvider.phone" />
                  </b-form-group>
                  <b-form-group :label="`Note`">
                    <b-form-input v-model="newProvider.note" />
                  </b-form-group>
                  <div class="float-right ml-2">
                    <b-button type="submit" size="lg" variant="main-color">
                      <span class="label">SUBMIT</span>
                    </b-button>
                    <div class="float-left mr-2">
                      <b-button
                        size="lg"
                        variant="danger"
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
                  <b-input
                    v-model="s"
                    :placeholder="`Search`"
                    @input="search(s)"
                  />
                </div>
              </div>
              <div class="float-md-right pt-1">
                <span class="text-muted text-small mr-1 mb-2">
                  {{ from }} - {{ to }} of {{ stateProviders.total }}</span
                >
                <b-dropdown
                  id="ddown2"
                  right
                  :text="`${stateProviders.query.limit}`"
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
        <b-row>
          <b-col
            v-for="(provider, index) in stateProviders.providers"
            :id="provider.id"
            :key="index"
            xs="12"
            class="mb-4"
          >
            <DataListProviders
              :key="provider.id"
              v-contextmenu:contextmenu
              :data="provider"
              :selected-provider="stateProviders.selectedProvider"
              :fetch="fetchData"
              @toggle-item="toggleItem"
            />
          </b-col>
        </b-row>
      </template>
      <b-pagination-nav
        v-model="stateProviders.query.page"
        :number-of-pages="stateProviders.pageCount"
        :per-page="stateProviders.query.limit"
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
import { DataListProviders } from '@/components/uncommon/Providers'

import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  components: {
    Breadcrumb,
    DataListProviders,
  },
  async fetch() {
    try {
      this.setProviderQuery(this.$route.query)
      await this.fetchDataProviders()
    } catch (e) {
      this.$toast.error(e)
    }
  },
  data() {
    return {
      sort: {
        column: 'name',
        label: 'Name',
      },
      sortOptions: [
        {
          column: 'name,ASC',
          label: 'Name',
        },
        {
          column: 'gender,ASC',
          label: 'Gender',
        },
        {
          column: 'birthday,ASC',
          label: 'Birthday',
        },
      ],
      s: '',
      genderChoice: ['MALE', 'FEMALE'],
      pageSizes: [5, 10, 15],
      newProvider: {
        email: '',
        name: '',
        birthday: '',
        gender: '',
        phone: '',
        avatar: '',
        note: '',
      },
      moment,
      value: '',
      processing: false,
      file: null,
      imageUrl: '',
    }
  },
  layout: 'admin',
  computed: {
    ...mapState({
      stateProviders: (state) => state.providers,
    }),
    from() {
      return (
        this.stateProviders.query.limit * (this.stateProviders.query.page - 1) +
        1
      )
    },
    to() {
      if (
        this.stateProviders.query.limit * (this.stateProviders.query.page - 1) +
          this.stateProviders.query.limit >
        this.stateProviders.total
      ) {
        return this.stateProviders.total
      } else {
        return (
          this.stateProviders.query.limit *
            (this.stateProviders.query.page - 1) +
          this.stateProviders.query.limit
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
      'fetchDataProviders',
      'setDataProviderSelected',
      'addProvider',
      'deleteProvider',
      'editProvider',
    ]),
    ...mapMutations({
      setProviderQuery: 'SET_PROVIDER_QUERY',
    }),
    async submitFormAdd() {
      try {
        this.processing = true
        console.log('Add provider clicked - Add Provider: ', this.newProvider)
        await this.addProvider(this.newProvider)
        this.stateProviders.selectedProvider = []
        this.$fetch()
        this.hideModal('modalright')
        this.newProvider = {
          email: '',
          password: '',
          fullName: '',
          birthday: '',
          gender: '',
          phone: '',
          avatar: '',
          status: '',
        }
        this.$toast.success('Add successful')
        this.value = ''
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    async onContextDelete() {
      try {
        this.processing = true
        await this.deleteProvider(this.stateProviders.selectedProvider)
        this.stateProviders.selectedProvider = []
        this.$fetch()
        this.$toast.success('Delete successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    selectAll(isToggle) {
      const providersForToggle = this.stateProviders.providers
      if (
        this.stateProviders.selectedProvider.length >=
        this.stateProviders.providers.length
      ) {
        if (isToggle)
          this.stateProviders.selectedProvider.splice(
            0,
            this.stateProviders.selectedProvider.length
          )
      } else {
        this.stateProviders.selectedProvider.push(
          ...providersForToggle.map((provider) => {
            return provider.id
          })
        )
      }
    },
    isSelectedAll() {
      return (
        this.stateProviders.selectedProvider.length >=
        this.stateProviders.providers.length
      )
    },
    isAnyItemSelected() {
      return (
        this.stateProviders.selectedProvider.length > 0 &&
        this.stateProviders.selectedProvider.length <
          this.stateProviders.providers.length
      )
    },
    keymap(event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.stateProviders.selectedProvider.splice(
            0,
            this.stateProviders.selectedProvider.length
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
    toggleItem(event, providerId) {
      if (event.shiftKey && this.stateProviders.selectedProvider.length > 0) {
        let providersForToggle = this.stateProviders.providers
        const start = this.getIndex(providerId, providersForToggle, 'id')
        const end = this.getIndex(
          this.stateProviders.selectedProvider[
            this.stateProviders.selectedProvider.length - 1
          ],
          providersForToggle,
          'id'
        )
        providersForToggle = providersForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        )
        this.stateProviders.selectedProvider.push(
          ...providersForToggle.map((provider) => {
            return provider.id
          })
        )
      } else if (this.stateProviders.selectedProvider.includes(providerId)) {
        this.stateProviders.selectedProvider.splice(
          this.stateProviders.selectedProvider.indexOf(providerId),
          1
        )
      } else this.stateProviders.selectedProvider.push(providerId)
    },
    handleContextmenu(vnode) {
      if (!this.stateProviders.selectedProvider.includes(vnode.key)) {
        this.stateProviders.selectedProvider.splice(
          0,
          this.stateProviders.selectedProvider.length
        )
        this.stateProviders.selectedProvider.push(vnode.key)
      }
    },
    onContextCopy() {
      console.log(
        'context menu item clicked - Copy Items: ',
        this.stateProviders.selectedProvider
      )
    },
    onContextArchive() {
      console.log(
        'context menu item clicked - Move to Archive Items: ',
        this.stateProviders.selectedProvider
      )
    },
    async fetchData() {
      this.setProviderQuery(this.$route.query)
      await this.fetchDataProviders()
    },
    hideModal(refname) {
      this.$refs[refname].hide()
    },
    onContext(ctx) {
      this.newProvider.birthday = moment(ctx.selectedYMD, moment.ISO_8601)
    },
    changeOrderBy(sort) {
      this.sort = sort
      this.stateProviders.query.sort = sort.column
      this.$fetch()
    },
    async search(s) {
      this.stateProviders.query.s = '{"name":{"$cont": "' + s + '"}}'
      await this.fetchDataProviders()
    },
    changePageSize(perPage) {
      this.perPage = perPage
      this.stateProviders.query.limit = perPage
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
          this.newProvider.avatar = imageUrl
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
