require('dotenv').config()
export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Nunito:300,400,400i,600,700',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#145388' },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '@/utils/filters',
    '@/services/file.js',
    '@/services/geocode.js',
    '@/plugins/bootstrap',
    '@/plugins/veeValidate',
    '@/plugins/vue-context-menu',
    '@/plugins/google-maps',
    '@/plugins/bus.js',
    { src: '@/plugins/vue-shortkey.js', mode: 'client' },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
  ],
  /*
   ** MomentJS for NuxtJS
   */
  moment: {
    locales: ['vi'],
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    'nuxt-vue-select',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt',
    '@nuxtjs/style-resources',
    'nuxt-simple-line-icons',
    [
      'vue-toastification/nuxt',
      {
        timeout: 2000,
      },
    ],
  ],
  styleResources: {
    // your settings here
    sass: [],
    scss: [
      '~/assets/scss/base/layout/_grid.scss',
      '~/assets/scss/base/themes/variables.scss',
    ],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL,
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true,
          },
        })
      }

      config.node = {
        fs: 'empty',
      }
    },
  },
}
