<template>
  <b-card
    :class="{
      'd-flex flex-row': true,
      active: selectedProvider.includes(data.id),
    }"
    no-body
    @click.prevent="toggleItem($event, data.id)"
  >
    <div class="pl-2 d-flex flex-grow-1 min-width-zero">
      <div
        class="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center"
      >
        <div class="w-15 w-sm-100">
          <b-img
            width="64"
            height="64"
            center
            :src="data.avatar"
            alt="Center image"
          ></b-img>
        </div>
        <router-link :to="`?p=${data.id}`" class="w-40 w-sm-100">
          <p class="list-item-heading mb-0 truncate">{{ data.name }}</p>
        </router-link>
        <p class="mb-0 text-muted text-small w-50 w-sm-100">
          {{ data.email }}
        </p>
        <p class="mb-0 text-muted text-small w-30 w-sm-100">
          {{ data.phone }}
        </p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100">
          {{ data.gender }}
        </p>
        <p class="mb-0 text-muted text-small w-15 w-sm-100">
          {{ moment(data.deletedAt).format('DD-MM-YYYY') }}
        </p>
      </div>
      <div class="custom-control custom-checkbox pl-1 align-self-center pr-4">
        <b-form-checkbox
          :checked="selectedProvider.includes(data.id)"
          class="itemCheck mb-0"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    selectedProvider: {
      name: 'selected-provider',
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      moment,
      processing: false,
    }
  },
  methods: {
    toggleItem(event, itemId) {
      this.$emit('toggle-item', event, itemId)
    },
  },
}
</script>
