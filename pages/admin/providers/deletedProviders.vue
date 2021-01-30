<template>
  <b-row>
    <b-col class="disable-text-selection">
      <b-row>
        <b-col xs="12">
          <breadcrumb heading="Providers"></breadcrumb>
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
            v-for="(provider, index) in stateProviders.deletedProviders"
            :id="provider.id"
            :key="index"
            xs="12"
            class="mb-4"
          >
            <DataListDeletedProviders
              :key="provider.id"
              v-contextmenu:contextmenu
              :data="provider"
              :selected-provider="stateProviders.deletedSelectedProvider"
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
import { DataListDeletedProviders } from '@/components/uncommon/Providers'

import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'

export default {
  components: {
    Breadcrumb,
    DataListDeletedProviders,
  },
  async fetch() {
    try {
      this.setProviderQuery(this.$route.query)
      await this.fetchDeletedProviders()
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
    ...mapState({
      stateProviders: (state) => state.providers,
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
      'fetchDeletedProviders',
      'setDeletedProviderSelected',
      'deleteProviderPer',
      'restoreProvider',
    ]),
    ...mapMutations({
      setProviderQuery: 'SET_PROVIDER_QUERY',
    }),
    async onContextDeletePer() {
      try {
        this.processing = true
        await this.deleteProviderPer(
          this.stateProviders.deletedSelectedProvider
        )
        this.stateProviders.deletedSelectedProvider = []
        this.$fetch()
        this.$toast.success('Deleted Permanently')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    async onContextRestore() {
      try {
        this.processing = true
        await this.restoreProvider(this.stateProviders.deletedSelectedProvider)
        this.stateProviders.deletedSelectedProvider = []
        this.$fetch()
        this.$toast.success('Restored')
      } catch (e) {
        this.$toast.error(e)
      } finally {
        this.processing = false
      }
    },
    selectAll(isToggle) {
      const providersForToggle = this.stateProviders.deletedProviders
      if (
        this.stateProviders.deletedSelectedProvider.length >=
        this.stateProviders.deletedProviders.length
      ) {
        if (isToggle)
          this.stateProviders.deletedSelectedProvider.splice(
            0,
            this.stateProviders.deletedSelectedProvider.length
          )
      } else {
        this.stateProviders.deletedSelectedProvider.push(
          ...providersForToggle.map((provider) => {
            return provider.id
          })
        )
      }
    },
    isSelectedAll() {
      return (
        this.stateProviders.deletedSelectedProvider.length >=
        this.stateProviders.deletedProviders.length
      )
    },
    isAnyItemSelected() {
      return (
        this.stateProviders.deletedSelectedProvider.length > 0 &&
        this.stateProviders.deletedSelectedProvider.length <
          this.stateProviders.deletedProviders.length
      )
    },
    keymap(event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false)
          break
        case 'undo':
          this.stateProviders.deletedSelectedProvider.splice(
            0,
            this.stateProviders.deletedSelectedProvider.length
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
      if (
        event.shiftKey &&
        this.stateProviders.deletedSelectedProvider.length > 0
      ) {
        let providersForToggle = this.stateProviders.deletedProviders
        const start = this.getIndex(providerId, providersForToggle, 'id')
        const end = this.getIndex(
          this.stateProviders.deletedSelectedProvider[
            this.stateProviders.deletedSelectedProvider.length - 1
          ],
          providersForToggle,
          'id'
        )
        providersForToggle = providersForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        )
        this.stateProviders.deletedSelectedProvider.push(
          ...providersForToggle.map((provider) => {
            return provider.id
          })
        )
      } else if (
        this.stateProviders.deletedSelectedProvider.includes(providerId)
      ) {
        this.stateProviders.deletedSelectedProvider.splice(
          this.stateProviders.deletedSelectedProvider.indexOf(providerId),
          1
        )
      } else this.stateProviders.deletedSelectedProvider.push(providerId)
    },
    handleContextmenu(vnode) {
      if (!this.stateProviders.deletedSelectedProvider.includes(vnode.key)) {
        this.stateProviders.deletedSelectedProvider.splice(
          0,
          this.stateProviders.deletedSelectedProvider.length
        )
        this.stateProviders.deletedSelectedProvider.push(vnode.key)
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
