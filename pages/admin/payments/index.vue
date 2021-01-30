<template>
  <div>
    <div>
      <breadcrumb heading="Payments"></breadcrumb>
    </div>
    <div>
      <b-card title="Manage Payments">
        <b-table
          head-variant="light"
          responsive
          :busy="$fetchState.pending"
          :items="statePayment.payments"
          :fields="fields"
          primary-key="id"
        >
          <template v-slot:cell(select)="{ item }">
            <b-form-checkbox
              :checked="selected.includes(item.id)"
              @change="
                (checked) => {
                  toggleSelection(item.id, checked)
                }
              "
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
                <b-col>User: {{ item.userId }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Amount:</b></b-col>
                <b-col>{{ item.amount }}</b-col>
              </b-row>

              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Type:</b></b-col>
                <b-col>{{ item.type }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Description:</b></b-col>
                <b-col>{{ item.description }}</b-col>
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
        </b-table>
        <b-pagination
          v-if="!$fetchState.pending"
          v-model="currentPage"
          size="sm"
          align="center"
          :total-rows="statePayment.total"
          :per-page="statePayment.query.limit"
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
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { fileMixin } from '@/mixins'
export default {
  layout: 'admin',
  middleware: 'authenticated',
  components: {},
  mixins: [fileMixin],
  async fetch() {
    try {
      this.setPaymentQuery(this.$route.query)
      await this.fetchDataPayments()
    } catch (e) {
      this.$toast.error(e)
    }
  },
  data() {
    return {
      processing: false,
      disabled: true,
      language: 'En',
      fields: [
        'select',
        { key: 'id', label: 'Index', sortable: true },
        'details',
        { key: 'createdAt', sortable: true },
        { key: 'updatedAt', sortable: true },
      ],
      searchKeyword: this.$route.query.q ? this.$route.query.q : '',
      selected: [],
    }
  },
  computed: {
    ...mapState({
      statePayment: (state) => state.payment,
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
  methods: {
    ...mapActions(['fetchDataPayments']),
    ...mapMutations({
      setPaymentQuery: 'SET_PAYMENT_QUERY',
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

    sortingChanged(ctx) {
      let fieldSort = ''
      if (['name'].includes(ctx.sortBy) && this.language === 'En') {
        fieldSort = `en${
          ctx.sortBy.charAt(0).toUpperCase() + ctx.sortBy.slice(1)
        }`
      } else if (['name'].includes(ctx.sortBy) && this.language === 'Vi') {
        fieldSort = `vi${
          ctx.sortBy.charAt(0).toUpperCase() + ctx.sortBy.slice(1)
        }`
      } else {
        fieldSort = ctx.sortBy
      }
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

    toggleSelection(idItem, checked) {
      if (checked) {
        this.selected.push(idItem)
      } else {
        this.selected = this.selected.filter((item) => item !== idItem)
      }
    },
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
