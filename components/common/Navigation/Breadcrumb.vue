<template>
  <span>
    <h2 v-if="heading && heading.length > 0" class="d-inline ml-5">
      {{ heading }}
    </h2>
    <b-nav
      class="pt-0 breadcrumb-container d-none d-sm-block d-lg-inline-block"
    >
      <b-breadcrumb :items="items" />
    </b-nav>
  </span>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    const path = this.$route.path.substr(1)
    let rawPaths = path.split('/')

    for (const pName in this.$route.params) {
      if (rawPaths.includes(this.$route.params[pName])) {
        rawPaths = rawPaths.filter((x) => x !== this.$route.params[pName])
      }
    }
    rawPaths.map((sub, index) => {
      this.items.push({
        text: sub.charAt(0).toUpperCase() + sub.slice(1),
        to: this.getUrl(path, sub, index),
      })
    })
  },
  methods: {
    getUrl(path, sub, index) {
      const pathToGo = '/' + path.split(sub)[0] + sub
      return pathToGo
    },
  },
}
</script>
