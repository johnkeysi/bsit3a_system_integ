import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: { transpile: ['vuetify'] },
  css: ['leaflet/dist/leaflet.css'],
  
  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: { template: { transformAssetUrls } },
  },

  runtimeConfig: {
    public: {
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    }
  },
})