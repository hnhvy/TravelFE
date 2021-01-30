<template>
  <div>
    <navbar></navbar>
    <div class="layout-content h-100">
      <sidebar></sidebar>
      <nuxt />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar } from '~/components/common'
export default {
  components: {
    Navbar,
    Sidebar,
  },
  middleware: 'authenticated',
}
</script>
