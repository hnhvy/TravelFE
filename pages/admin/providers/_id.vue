<template>
  <div>
    <div>
      <breadcrumb heading="Providers"></breadcrumb>
    </div>
    <div v-if="is_data_fetched">
      <b-row>
        <b-col xxs="12" lg="5" xl="4" class="col-left">
          <b-card class="mb-4" no-body>
            <b-card-body>
              <b-img :src="stateProviders.provider.avatar" fluid center />
              <div class="text-center pt-4 mb-10">
                <p class="list-item-heading pt-2 mb-5">
                  {{ stateProviders.provider.name }}
                </p>
                <b-button
                  id="button-edit-profile"
                  size="sm"
                  variant="outline-main-color"
                  @click="fillDataFormEditProvider(stateProviders.provider.id)"
                >
                  <b-icon icon="pencil" aria-hidden="true"></b-icon>
                </b-button>
                <b-button
                  id="button-add-billInfo"
                  size="sm"
                  variant="outline-main-color"
                  @click="fillDataFormAddBillInfo(stateProviders.provider.id)"
                >
                  <b-icon icon="card-list" aria-hidden="true"></b-icon
                ></b-button>
                <b-tooltip
                  target="button-edit-profile"
                  title="Edit Profile"
                  placement="leftbottom"
                ></b-tooltip>
                <b-tooltip
                  target="button-add-billInfo"
                  title="Add Bill Info"
                  placement="leftbottom"
                ></b-tooltip>
              </div>
              <p class="text-muted text-small mb-2">
                Gender
              </p>
              <p class="mb-3">{{ stateProviders.provider.gender }}</p>
              <p class="text-muted text-small mb-2">
                Birthday
              </p>
              <p class="mb-3">
                {{
                  moment(stateProviders.provider.birthday).format('DD-MM-YYYY')
                }}
              </p>
              <p class="text-muted text-small mb-2">
                Email
              </p>
              <p class="mb-3">{{ stateProviders.provider.email }}</p>
              <p class="text-muted text-small mb-2">
                Phone
              </p>
              <p class="mb-3">{{ stateProviders.provider.phone }}</p>
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
                  {{
                    moment(stateProviders.provider.createdAt).format(
                      'DD-MM-YYYY'
                    )
                  }}
                </p>
                <p class="text-muted text-small mb-2">
                  Updated At
                </p>
                <p class="mb-3">
                  {{
                    moment(stateProviders.provider.updatedAt).format(
                      'DD-MM-YYYY'
                    )
                  }}
                </p>
              </div>
            </b-card-body>
          </b-card>
          <div class="separator mb-5" />
          <b-card no-body>
            <b-card-body>
              <div class="pt-4">
                <p class="text-muted text-small mb-2">
                  Note
                </p>
                <p class="mb-3">{{ stateProviders.provider.note }}</p>
              </div>
            </b-card-body>
          </b-card>
          <div class="separator mb-5" />
          <b-card v-if="stateProviders.provider.billInfos" no-body>
            <b-card-body>
              <div class="pt-4">
                <p class="text-muted text-small mb-2">
                  Bill Infos
                </p>
                <li v-for="billInfo in stateProviders.provider.billInfos" :key="billInfo.id" class="mb-3">
                  Bank: {{ billInfo.bankName }} - Bank Account: {{ billInfo.bankAccount }}
                </li>
              </div>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <div>
        <b-modal
          ref="modal-edit"
          no-close-on-backdrop
          no-close-on-esc
          :title="`Edit Provider`"
          hide-footer
          scrollable
        >
          <FormEditProviders
            :provider="stateProviders.provider"
            :processing="processing"
            no-close-on-backdrop
            @hide-modal="hideModalEdit"
            @submit-form-edit="submitFormEdit"
          ></FormEditProviders>
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
            :provider="stateProviders.provider"
            :processing="processing"
            no-close-on-backdrop
            @hide-modal="hideModalAdd"
            @submit-form-add="submitFormAdd"
          ></FormAddBillInfo>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { Breadcrumb } from '@/components/common'
import { FormEditProviders } from '@/components/uncommon/Providers'
import { FormAddBillInfo } from '@/components/uncommon'

import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  layout: 'admin',
  components: {
    Breadcrumb,
    FormEditProviders,
    FormAddBillInfo,
  },
  async fetch() {
    this.setProviderQuery(this.$route.query)
    await this.fetchDataProvider(this.$route.params.id)
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
      stateProviders: (state) => state.providers,
      stateBillInfo: (state) => state.billInfo,
    }),
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
  methods: {
    ...mapActions([
      'fetchDataProvider',
      'setDataProviderSelected',
      'editProvider',
      'fetchDataBillInfos',
      'addBillInfo',
    ]),
    ...mapMutations({
      setProviderQuery: 'SET_PROVIDER_QUERY',
      setBillInfoQuery: 'SET_BILL_INFO_QUERY',
    }),
    async submitFormEdit(form) {
      try {
        this.processing = true
        console.log('Edit provider clicked - Edit provider: ', form)
        await this.editProvider(form)
        this.$fetch()
        this.$refs['modal-edit'].hide()
        this.$toast.success('Edit successful')
      } catch (e) {
        this.$toast.error(e)
      }
    },
    async submitFormAdd(form) {
      try {
        this.processing = true
        console.log('Add Bill Info clicked - Add Bill Info: ', form)
        this.stateBillInfo.query.type = 'PROVIDER'
        await this.addBillInfo(form)
        this.$fetch()
        this.$refs['modal-add'].hide()
        this.$toast.success('Create successful')
      } catch (e) {
        this.$toast.error(e)
      }
    },

    fillDataFormEditProvider(id) {
      this.$refs['modal-edit'].show()
    },
    fillDataFormAddBillInfo(id) {
      this.$refs['modal-add'].show()
    },
    hideModalEdit() {
      this.$refs['modal-edit'].hide()
    },
    hideModalAdd() {
      this.$refs['modal-add'].hide()
    },
  },
}
</script>

<style></style>
