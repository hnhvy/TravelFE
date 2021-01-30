<template>
  <div>
    <gmap-map
      :center="center"
      :map-type-id="mapTypeId"
      :zoom="15"
      style="width: 100%; height: calc(100vh - 200px);"
    >
      <gmap-marker
        :position="marker.position"
        @click="center = item.position"
      />
    </gmap-map>
  </div>
</template>

<script>
export default {
  props: {
    lat: {
      type: Number,
      default: 0,
    },
    lng: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      mapTypeId: 'terrain',
    }
  },
  computed: {
    center() {
      return { lat: this.lat, lng: this.lng }
    },
    marker() {
      return { position: { lat: this.lat, lng: this.lng } }
    },
  },
}
</script>

<style lang="scss" scoped></style>
