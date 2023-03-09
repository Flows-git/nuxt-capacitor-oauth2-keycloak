export default {
  target: 'static',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-capacitor-oauth2-keycloak',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ mode: 'client', src: 'plugins/appUrlOpen' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  router: {
    middleware: ['auth'],
  },

  // Nuxt auth plugin: https://auth.nuxtjs.org/
  auth: {
    resetOnError: false,
    strategies: {
      local: false,
      keycloak: {
        scheme: '~/schemes/customOauth2',
        token: {
          property: 'access_token',
          type: 'Bearer',
          name: 'Authorization',
          maxAge: 300,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 30,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          authorization: `${process.env.AUTH_URL}/protocol/openid-connect/auth`,
          userInfo: `${process.env.AUTH_URL}/protocol/openid-connect/userinfo`,
          token: `${process.env.AUTH_URL}/protocol/openid-connect/token`,
          logout:
            `${process.env.AUTH_URL}/protocol/openid-connect/logout?redirect_uri=` +
            encodeURIComponent(String(process.env.REDIRECT_URL)),
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: 'S256',
        redirectUri: process.env.REDIRECT_URL,
        // autoLogout: false
      },
    },
    redirect: {
      login: '/login',
      logout: '/login',
      home: '/',
      callback: '/login',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
