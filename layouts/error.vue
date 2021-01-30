<template>
  <div>
    <b-card>
      <b-jumbotron
        v-if="error.statusCode === 403"
        header="403"
        lead="Sorry, you are not authorized to access this page."
        header-level="4"
      >
        <hr class="my-4" />
        <p class="lead mb-0">
          <nuxt-link to="/admin"
            ><b-button variant="main-color" size="lg"
              >Go to default page</b-button
            ></nuxt-link
          >
        </p>
      </b-jumbotron>
    </b-card>
  </div>
</template>
<script>
export default {
  layout: 'admin',
  props: ['error'],
  data() {
    return {}
  },
}
</script>
