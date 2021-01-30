<template>
  <div>
    <div>
      <breadcrumb heading="Customers"></breadcrumb>
    </div>
    <div>
      <b-card title="Manage Categories">
        <div class="mb-6 d-flex align-items-center">
          <b-row class="w-50">
            <b-col cols="5">
              <b-input-group class="mb-3" size="sm">
                <b-input-group-prepend class="w-40">
                  <b-form-select
                    v-model="selectedFieldSearch"
                    size="sm"
                    class="shadow-none rounded-pill select-search"
                  >
                    <option value="id">Index</option>
                    <option value="fullName">Name</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                  </b-form-select>
                </b-input-group-prepend>
                <b-form-input
                  v-model="searchKeyword"
                  class="rounded-pill input-search"
                  placeholder="Search"
                  @keyup.enter="search"
                />
              </b-input-group>
            </b-col>
          </b-row>
          <!-- <div class="ml-auto">
            <b-button
              v-b-modal.modal-create
              size="sm"
              variant="outline-main-color"
              class="mr-2"
            >
              <span class="label"
                ><b-icon
                  icon="plus"
                  font-scale="1.5"
                  class="mr-1"
                />Create</span
              >
            </b-button>
            <b-button
              size="sm"
              :class="{
                'btn-multiple-state': true,
                'show-spinner': processing,
              }"
              :disabled="disabled"
              variant="danger"
              @click="onDelete()"
            >
              <span class="spinner d-inline-block">
                <span class="bounce1"></span>
                <span class="bounce2"></span>
                <span class="bounce3"></span>
              </span>
              <span class="label"
                ><b-icon
                  icon="trash"
                  font-scale="1.5"
                  class="mr-1"
                />Delete</span
              >
            </b-button>
          </div> -->
        </div>
        <b-table
          head-variant="light"
          responsive
          :busy="$fetchState.pending"
          :items="stateCustomer.customers"
          :fields="fields"
          primary-key="id"
          @sort-changed="sortingChanged"
        >
          <!-- <template v-slot:cell(select)="{ item }">
            <b-form-checkbox
              :checked="selected.includes(item.id)"
              @change="
                (checked) => {
                  toggleSelection(item.id, checked)
                }
              "
            />
          </template> -->
          <template v-slot:cell(avatar)="{ item }">
            <b-button
              variant="outline-main-color"
              size="sm"
              @click="showAvatar(item.id)"
            >
              Show
            </b-button>
          </template>
          <template v-slot:cell(createdAt)="{ value }">
            {{ value | formatDate }}
          </template>
          <template v-slot:cell(updatedAt)="{ value }">
            {{ value | formatDate }}
          </template>
          <template v-slot:table-busy>
            <div class="text-center text-main-color my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template v-slot:cell(action)="{ item }">
            <b-button
              variant="outline-main-color"
              size="sm"
              @click="fillFormEditService(item.id)"
              >Edit</b-button
            >
            <b-button
              variant="outline-main-color"
              size="sm"
              @click="fillDataFormAddBillInfo(item.id)"
              >Bill Infos</b-button
            >
          </template>
        </b-table>
        <b-pagination
          v-if="!$fetchState.pending"
          v-model="currentPage"
          size="sm"
          align="center"
          :total-rows="stateCustomer.total"
          :per-page="stateCustomer.query.limit"
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
        </b-pagination>
      </b-card>
    </div>
    <div>
      <b-modal id="modal-avatar" ref="modal-avatar" hide-footer size="sm">
        <div class="d-flex justify-content-center align-items-center">
          <b-img thumbnail fluid :src="urlAvatarSelected"></b-img></div
      ></b-modal>
      <b-modal id="modal-create" ref="modal-create" hide-footer size="lg">
        <form-edit-customer
          :processing="processing"
          @onSubmit="onCreate"
        ></form-edit-customer>
      </b-modal>
      <b-modal
          ref="modal-add"
          no-close-on-backdrop
          no-close-on-esc
          :title="`Add Bill Info`"
          hide-footer
          scrollable
        >
          <FormAddBillInfo
            :customer="stateCustomer.customer"
            :processing="processing"
            no-close-on-backdrop
            @hide-modal="hideModalAdd"
            @submit-form-add="submitFormAdd"
          ></FormAddBillInfo>
        </b-modal>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import { FormEditCustomer , FormAddBillInfo } from '@/components/uncommon'
export default {
  layout: 'admin',
  components: {
    FormEditCustomer,
    FormAddBillInfo
  },
  middleware: 'authorization',
  permissions: ['CUSTOMER_READ'],
  async fetch() {
    try {
      this.setCustomerQuery(this.$route.query)
      await this.fetchDataCustomers()
    } catch (e) {
      this.$toast.error(e)
    }
  },
  data() {
    return {
      processing: false,
      disabled: true,
      location: {
        latitude: '',
        longitude: '',
      },
      fields: [
        // 'select',
        { key: 'id', label: 'Index', sortable: true },
        { key: 'fullName', label: 'Name', sortable: true },
        { key: 'email', sortable: true },
        'gender',
        'birthday',
        'phone',
        'avatar',
        { key: 'createdAt', sortable: true },
        { key: 'updatedAt', sortable: true },
        // 'action',
      ],
      searchKeyword: this.$route.query.q ? this.$route.query.q : '',
      selectedFieldSearch: this.$route.query.s
        ? this.$route.query.s
        : 'fullName',
      urlAvatarSelected: '',
      selected: [],
    }
  },
  computed: {
    ...mapState({
      stateCustomer: (state) => state.customer,
      stateBillInfo: (state) => state.billInfo,
    }),
    currentPage: {
      get() {
        if (this.$route.query.page) return this.$route.query.page
        else return 1
      },
      set(val) {
        if (this.$route.query.s && this.$route.query.q)
          return this.$router.push({
            query: Object.assign({}, this.$route.query, {
              s: this.selectedFieldSearch,
              q: this.searchKeyword,
              page: val,
            }),
          })
        return this.$router.push({
          query: Object.assign({}, this.$route.query, {
            page: val,
          }),
        })
      },
    },
  },
  watch: {
    $route() {
      this.$fetch()
    },
    selected(val) {
      if (val.length > 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    },
  },
  created() {
    console.log(this.stateCustomer.customers)
  },
  methods: {
    ...mapActions(['fetchDataCustomers', 'fetchDataCustomer','addBillInfo']),
    ...mapMutations({
      setCustomerQuery: 'SET_CUSTOMER_QUERY',
      setBillInfoQuery: 'SET_BILL_INFO_QUERY',
    }),
    sortingChanged(ctx) {
      const fieldSort = ctx.sortBy
      if (ctx.sortDesc) {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            sort: `${fieldSort},DESC`,
          }),
        })
      } else {
        this.$router.push({
          query: Object.assign({}, this.$route.query, {
            sort: `${fieldSort},ASC`,
          }),
        })
      }
    },
    showAvatar(id) {
      this.urlAvatarSelected = this.stateCustomer.customers
        .filter((item) => (item.id = id))
        .map((item) => item.avatar)[0]
      this.$refs['modal-avatar'].show()
    },
    search() {
      this.$router.push({
        query: { s: this.selectedFieldSearch, q: this.searchKeyword },
      })
    },
    async submitFormAdd(form) {
      try {
        this.processing = true
        console.log('Add Bill Info clicked - Add Bill Info: ', form)
        this.stateBillInfo.query.type = 'CUSTOMER'
        await this.addBillInfo(form)
        this.$fetch()
        this.$refs['modal-add'].hide()
        this.$toast.success('Create successful')
      } catch (e) {
        this.$toast.error(e)
      }
    },
    async fillDataFormAddBillInfo(id) {
      await this.fetchDataCustomer(id)
      this.$refs['modal-add'].show()
    },
    hideModalAdd() {
      this.$refs['modal-add'].hide()
    },
    onCreate() {},
    
  },
}
</script>
<style lang="scss" scoped>
.input-search {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.select-search {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
</style>