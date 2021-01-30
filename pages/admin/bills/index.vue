<template>
  <div>
    <div>
      <breadcrumb heading="Bills"></breadcrumb>
    </div>
    <div>
      <b-card title="Manage Bills">
        <div class="mb-6 d-flex align-items-center">
          <div class="mb-6 d-flex align-items-center">
            <b class="mr-2">Added by:</b>
            <b-form-radio-group v-model="isUserNull">
              <b-form-radio value="notnull" @input="isUser()">Users</b-form-radio>
              <b-form-radio value="isnull">Customers</b-form-radio>
            </b-form-radio-group>
          </div>
          <div class="ml-auto">
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
          </div>
        </div>
        <b-table
          head-variant="light"
          responsive
          :busy="$fetchState.pending"
          :items="stateBill.bills"
          :fields="fields"
          primary-key="id"
        >
          <template v-slot:cell(select)="{ item }">
            <b-form-checkbox
              :checked="selected.includes(item.id)"
              @change="
                (checked) => {
                  toggleSelection(item.id, checked)
                }"
            />
          </template>
          <template v-slot:cell(details)="{ item, detailsShowing }">
            <b-button
              variant="outline-main-color"
              size="sm"
              @click="changeDetailsLanguage(item)"
            >
              {{ detailsShowing ? 'Hide' : 'Show' }} details
            </b-button>
          </template>
          <template v-slot:row-details="{ item }">
            <b-card>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Added by</b></b-col>
                <b-col v-if="item.user">User: {{ item.user.fullName }}</b-col>
                <b-col v-else>Customer: {{ item.customer.fullName }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"
                  ><b>Customer Remaining:</b></b-col
                >
                <b-col>{{ item.customerRemain }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"
                  ><b>Provider Remaining:</b></b-col
                >
                <b-col>{{ item.providerRemain }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Total Price:</b></b-col>
                <b-col>{{ item.totalPrice }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"
                  ><b>Total Net Price:</b></b-col
                >
                <b-col>{{ item.totalNetPrice }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Customer:</b></b-col>
                <b-col>{{ item.customer.fullName }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Status:</b></b-col>
                <b-col>{{ item.status }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Note:</b></b-col>
                <b-col>{{ item.note }}</b-col>
              </b-row>
            </b-card>
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
              @click="fillFormEditBill(item.id)"
              >Edit</b-button
            >
            <b-button
              variant="outline-main-color"
              size="sm"
              @click="
                fillFormAddPayment(
                  item.id,
                  item.customer.id,
                  item.billServices[0].serviceId
                )"
              >Pay</b-button
            >
          </template>
        </b-table>
        <b-pagination
          v-if="!$fetchState.pending"
          v-model="currentPage"
          size="sm"
          align="center"
          :total-rows="stateBill.total"
          :per-page="stateBill.query.limit"
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
      <b-modal id="modal-create" ref="modal-create" hide-footer size="lg">
        <FormEditBill
          :processing="processing"
          :customers="stateCustomer.customers"
          :services="stateService.services"
          @onSubmit="onCreate"
          @fetchSelectedCustomer="fetchSelectedCustomer"
        ></FormEditBill>
      </b-modal>
      <b-modal ref="modal-update" hide-footer size="lg">
        <FormEditBill
          :processing="processing"
          :bill="stateBill.selectedBill"
          :customers="stateCustomer.customers"
          :services="stateService.services"
          @onSubmit="onUpdate"
          @fetchSelectedCustomer="fetchSelectedCustomer"
        ></FormEditBill>
      </b-modal>
      <b-modal
        ref="modal-add"
        no-close-on-backdrop
        no-close-on-esc
        :title="`Add Payment`"
        hide-footer
        scrollable
      >
        <FormAddPayment
          :processing="processing"
          :bill="stateBill.selectedBill"
          :customer="stateCustomer.customer"
          :provider="stateProvider.provider"
          no-close-on-backdrop
          @hide-modal="hideModalAdd"
          @submit-form-add="submitFormAdd"
          @fetch="fetchDataCustomer"
        ></FormAddPayment>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { FormEditBill, FormAddPayment } from '@/components/uncommon'
import { fileMixin } from '@/mixins'
export default {
  layout: 'admin',
  middleware: 'authenticated',
  components: {
    FormEditBill,
    FormAddPayment,
  },
  mixins: [fileMixin],
  async fetch() {
    try {
      this.setBillQuery(this.$route.query)
      await this.fetchDataBills()
      await this.fetchDataCustomers()
      await this.fetchAllCustomers()
      await this.fetchDataServices()
      await this.fetchAllServices()
      await this.fetchDataProviders()
    } catch (e) {
      this.$toast.error(e)
    }
  },
  data() {
    return {
      isUserNull: 'notnull',
      processing: false,
      disabled: true,
      fields: [
        'select',
        { key: 'id', label: 'Index' },
        'details',
        'createdAt',
        'updatedAt',
        'action',
      ],
      searchKeyword: '',
      selected: [],
    }
  },
  computed: {
    ...mapState({
      stateBill: (state) => state.bill,
      stateCustomer: (state) => state.customer,
      stateService: (state) => state.service,
      stateProvider: (state) => state.providers,
    }),
    currentPage: {
      get() {
        if (this.$route.query.page) return this.$route.query.page
        else return 1
      },
      set(val) {
        this.$router.push({ query: { s: this.searchKeyword, page: val } })
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
    this.searchKeyword = this.$route.query.s
  },
  methods: {
    ...mapActions([
      'fetchDataBills',
      'fetchDataCustomers',
      'fetchDataServices',
      'setDataBillSelected',
      'addBill',
      'editBill',
      'deleteBill',
      'fetchDataCustomer',
      'addPayment',
      'fetchDataService',
      'fetchDataProviders',
      'fetchDataProvider',
    ]),
    ...mapMutations({
      setBillQuery: 'SET_BILL_QUERY',
      setCustomerQuery: 'SET_CUSTOMER_QUERY',
      setServiceQuery: 'SET_SERVICE_QUERY',
      setProviderQuery: 'SET_PROVIDER_QUERY',
    }),
    changeDetailsLanguage(item) {
      if (!item._showDetails) {
        Vue.set(item, 'selected', 'En')
      }
      Vue.set(item, '_showDetails', !item._showDetails)
    },
    search() {
      this.$router.push({ query: { s: this.searchKeyword } })
    },

    async onCreate(file, form) {
      try {
        this.processing = true
        await this.addBill(form)
        this.$refs['modal-create'].hide()
        this.$fetch()
        this.$toast.success('Create successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },

    toggleSelection(idItem, checked) {
      if (checked) {
        this.selected.push(idItem)
      } else {
        this.selected = this.selected.filter((item) => item !== idItem)
      }
    },

    async onDelete() {
      try {
        await Promise.all(
          this.selected.map((id) => {
            this.deleteBill(id)
          })
        )
        this.$toast.success('Delete successful')
        this.$fetch()
      } catch (e) {
        this.$toast.error(e)
      }
    },

    fillFormEditBill(id) {
      this.setDataBillSelected(id)
      this.$refs['modal-update'].show()
    },
    async fillFormAddPayment(id, customerId, serviceId) {
      if (serviceId == null) {
        this.setDataBillSelected(id)
        await this.fetchDataCustomer(customerId)
        this.$refs['modal-add'].show()
      } else {
        this.setDataBillSelected(id)
        await this.fetchDataCustomer(customerId)
        await this.fetchDataService(serviceId)
        await this.fetchDataProvider(this.stateService.service.providers[0].id)
        this.$refs['modal-add'].show()
      }
    },

    async onUpdate(file, form) {
      try {
        this.processing = true
        await this.editBill(form)
        this.$refs['modal-update'].hide()
        this.$fetch()
        this.$toast.success('Update successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    async submitFormAdd(form) {
      try {
        this.processing = true
        console.log('Add Payment clicked - Add Payment: ', form)
        await this.addPayment(form)
        this.$fetch()
        this.$refs['modal-add'].hide()
        this.$toast.success('Create successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    hideModalAdd() {
      this.$refs['modal-add'].hide()
    },
    async fetchSelectedCustomer(id) {
      await this.fetchDataCustomer(id)
      return this.stateCustomer.customer
    },
    async isUser() {
      this.stateBill.query.filter = 'userId||$' + this.isUserNull
      await this.fetchDataBills()
    },
    async fetchAllServices() {
      const allServices = []
      let i = this.stateService.pageCount
      for (i = this.stateService.pageCount; i > 0; i--) {
        this.stateService.query.page = i
        await this.fetchDataServices()
        this.stateService.services.forEach(service => {
          allServices.unshift(service)
        })
      }
      this.stateService.services = allServices
    },
    async fetchAllCustomers() {
      const allCustomers = []
      let i = this.stateCustomer.pageCount
      for (i = this.stateCustomer.pageCount; i > 0; i--) {
        this.stateCustomer.query.page = i
        await this.fetchDataCustomers()
        this.stateCustomer.customers.forEach(customer => {
          allCustomers.unshift(customer)
        })
      }
      this.stateCustomer.customers = allCustomers
    }
  },
}
</script>
