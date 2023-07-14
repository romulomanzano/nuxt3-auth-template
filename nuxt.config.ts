// nuxt.config.ts
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NODE_ENV !== "development"
          ? process.env.NODE_ENV === "production"
            ? "https://api.app.ooo/api/v1"
            : "https://app-staging.herokuapp.com/api/v1"
          : "http://localhost:8080/api/v1",
    },
  },
  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});
