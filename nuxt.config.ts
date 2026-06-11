// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
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
