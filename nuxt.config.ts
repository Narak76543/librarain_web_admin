// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  routeRules: {
    '/**': { ssr: false }
  },
  compatibilityDate: '2024-04-03',
  app: {
    head: {
      title: 'Librarain Admin',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },
  devtools: { enabled: false },
  telemetry: false,
  experimental: {
    appManifest: false,
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    viewer: false,
  },
  css: ['~/assets/css/main.css'],
})
