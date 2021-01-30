<template>
  <div>
    <div>
      <breadcrumb heading="Services"></breadcrumb>
    </div>
    <div>
      <b-card title="Manage Services">
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
                    <option value="viTitle">Vi Title</option>
                    <option value="enTitle">En Title</option>
                    <option value="enSlug">En Slug</option>
                    <option value="viSlug">Vi Slug</option>
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
          <div class="ml-auto">
            <b-button
            v-if="
              stateAuth.currentUser.role.permissions.some(
                (item) => item.name === 'SERVICE_CREATE' || item.name === 'ALL'
              )
            "
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
            v-if="
              stateAuth.currentUser.role.permissions.some(
                (item) => item.name === 'SERVICE_DELETE' || item.name === 'ALL'
              )
            "
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
        <div class="mb-6 d-flex align-items-center">
          <b class="mr-2">Language:</b>
          <b-form-radio-group v-model="language">
            <b-form-radio value="En">English</b-form-radio>
            <b-form-radio value="Vi">Vietnamese</b-form-radio>
          </b-form-radio-group>
        </div>
        <b-table
          head-variant="light"
          responsive
          :busy="$fetchState.pending"
          :items="stateService.services"
          :fields="fields"
          primary-key="id"
          @sort-changed="sortingChanged"
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
          <template v-slot:cell(title)="{ item }">
            {{ language == 'En' ? item.enTitle : item.viTitle }}
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
              <b-row class="justify-content-md-center">
                <b-col sm="10">
                  <b-carousel
                    v-model="slide"
                    :interval="4000"
                    class="my-5"
                    controls
                    indicators
                    @sliding-start="onSlideStart"
                    @sliding-end="onSlideEnd"
                  >
                    <b-carousel-slide
                      v-for="(el, index) in item.gallery"
                      :key="index"
                      :img-src="el"
                    >
                    </b-carousel-slide>
                  </b-carousel>
                </b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Owner:</b></b-col>
                <b-col>{{ item.user.fullName }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"
                  ><b>Current Price:</b></b-col
                >
                <b-col>{{ item.currentPrice }} / {{ item.unit }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Net Price:</b></b-col>
                <b-col>{{ item.netPrice }} / {{ item.unit }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Price:</b></b-col>
                <b-col>{{ item.price }} / {{ item.unit }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Note:</b></b-col>
                <b-col>{{ item.note }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Content:</b></b-col>
                <b-col
                  ><span
                    v-html="
                      language == 'En'
                        ? $options.filters.sanitize(item.enContent)
                        : $options.filters.sanitize(item.viContent)
                    "
                  ></span
                ></b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Description:</b></b-col>
                <b-col>{{
                  language == 'En' ? item.enDescription : item.viDescription
                }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Slug:</b></b-col>
                <b-col>{{
                  language == 'En' ? item.enSlug : item.viSlug
                }}</b-col>
              </b-row>
              <b-row class="mb-2">
                <b-col sm="2" class="text-sm-right"><b>Thumbnail:</b></b-col>
                <b-col>
                  <b-link :href="item.thumbnail">{{ item.thumbnail }}</b-link>
                </b-col>
              </b-row>
            </b-card>
          </template>
          <template v-slot:cell(createdAt)="{ value }">
            {{ value | formatDate }}
          </template>
          <template v-slot:cell(updatedAt)="{ value }">
            {{ value | formatDate }}
          </template>
          <template v-slot:cell(location)="{ item }">
            <b-button
              v-b-modal.modal-map
              variant="outline-main-color"
              size="sm"
              @click="showLocationOnMap(item.latitude, item.longitude)"
              >Show on map</b-button
            >
          </template>
          <template v-slot:table-busy>
            <div class="text-center text-main-color my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template v-slot:cell(action)="{ item }">
            <b-button
            v-if="
              stateAuth.currentUser.role.permissions.some(
                (item) => item.name === 'SERVICE_UPDATE' || item.name === 'ALL'
              )
            "
              variant="outline-main-color"
              size="sm"
              @click="fillFormEditService(item.id)"
              >Edit</b-button
            >
          </template>
        </b-table>
        <b-pagination
          v-if="!$fetchState.pending"
          v-model="currentPage"
          size="sm"
          align="center"
          :total-rows="stateService.total"
          :per-page="stateService.query.limit"
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
      <b-modal
        id="modal-create"
        ref="modal-create"
        no-enforce-focus
        no-close-on-backdrop
        hide-footer
        size="lg"
      >
        <multi-step-edit-service
          :processing="processing"
          :destinations="stateDestination.destinations"
          :categories="stateCategory.categories"
          :providers="stateProvider.providers"
          @loadDestinationOptions="loadDestinationOptions"
          @loadProviderOptions="loadProviderOptions"
          @onSubmit="onCreate"
        ></multi-step-edit-service>
      </b-modal>
      <b-modal
        ref="modal-update"
        no-enforce-focus
        no-close-on-backdrop
        hide-footer
        size="lg"
      >
        <multi-step-edit-service
          :service="stateService.serviceSelected"
          :processing="processing"
          :destinations="stateDestination.destinations"
          :categories="stateCategory.categories"
          :providers="stateProvider.providers"
          @loadDestinationOptions="loadDestinationOptions"
          @loadProviderOptions="loadProviderOptions"
          @onSubmit="onUpdate"
        ></multi-step-edit-service>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import { fileMixin } from '@/mixins'
import { MultiStepEditService } from '@/components/uncommon'
export default {
  layout: 'admin',
  components: {
    MultiStepEditService,
  },
  mixins: [fileMixin],
  async fetch() {
    this.setServiceQuery(this.$route.query)
    await Promise.all([
      this.fetchDataServices(),
      this.fetchDataCategories(),
      this.fetchDataDestinations(),
      this.fetchDataProviders(),
    ]).catch((e) => {
      this.$toast.error(e)
    })
  },
  data() {
    return {
      disabled: true,
      processing: false,
      language: 'En',
      fields: [
        'select',
        { key: 'id', label: 'Index', sortable: true },
        { key: 'title', sortable: true },
        'details',
        { key: 'createdAt', sortable: true },
        { key: 'updatedAt', sortable: true },
        'action',
      ],
      searchKeyword: this.$route.query.q ? this.$route.query.q : '',
      selectedFieldSearch: this.$route.query.s
        ? this.$route.query.s
        : 'viTitle',
      selected: [],
      slide: 0,
    }
  },
  computed: {
    ...mapState({
      stateAuth: (state) => state.auth,
      stateService: (state) => state.service,
      stateDestination: (state) => state.destination,
      stateCategory: (state) => state.category,
      stateProvider: (state) => state.providers,
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
    ...mapActions([
      'fetchDataServices',
      'fetchDataCategories',
      'fetchDataDestinations',
      'fetchDataProviders',
      'createService',
      'deleteService',
      'getDataServiceSelected',
      'updateService',
    ]),
    ...mapMutations({
      setServiceQuery: 'SET_SERVICE_QUERY',
      setDestinationQuery: 'SET_DESTINATION_QUERY',
      setProviderQuery: 'SET_PROVIDER_QUERY',
    }),

    changeDetailsLanguage(item) {
      Vue.set(item, '_showDetails', !item._showDetails)
    },

    async loadDestinationOptions(query) {
      this.setDestinationQuery({ s: query })
      await this.fetchDataDestinations()
    },

    async loadProviderOptions(query) {
      this.setProviderQuery({ s: query })
      await this.fetchDataProviders()
    },

    onSlideStart(slide) {
      this.sliding = true
    },

    onSlideEnd(slide) {
      this.sliding = false
    },

    search() {
      this.$router.push({
        query: { s: this.selectedFieldSearch, q: this.searchKeyword },
      })
    },

    sortingChanged(ctx) {
      let fieldSort = ''
      if (['title'].includes(ctx.sortBy) && this.language === 'En') {
        fieldSort = `en${
          ctx.sortBy.charAt(0).toUpperCase() + ctx.sortBy.slice(1)
        }`
      } else if (['title'].includes(ctx.sortBy) && this.language === 'Vi') {
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

    async onCreate(thumbnail, form) {
      try {
        this.processing = true
        form.thumbnail = await this.uploadFileToS3(thumbnail, 'Thumbnail')
        // form.gallery = await this.uploadFilesToS3(gallery, 'Gallery')
        await this.createService(form)
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

    onDelete() {
      try {
        Promise.all(this.selected.map((id) => this.deleteService(id)))
        this.selected = []
        this.$fetch()
        this.$toast.success('Delete successful')
      } catch (e) {
        this.$toast.error(e)
      }
    },

    fillFormEditService(id) {
      this.getDataServiceSelected(id)
      this.$refs['modal-update'].show()
    },

    async onUpdate(thumbnail, form) {
      try {
        this.processing = true
        if (thumbnail) {
          form.thumbnail = await this.uploadFileToS3(thumbnail, 'Thumbnail')
        }
        await this.updateService(form)
        this.$refs['modal-update'].hide()
        this.$fetch()
        this.$toast.success('Create successful')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
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
