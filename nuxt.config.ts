// nuxt.config.ts
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@sidebase/nuxt-auth"],
  auth: {
    globalAppMiddleware: true,
    provider: {
      type: "local",
      endpoints: {
        signIn: { path: "/auth/login", method: "post" },
        signOut: { path: "/auth/logout", method: "post" },
        signUp: { path: "/auth/register", method: "post" },
        getSession: { path: "/auth/user", method: "get" },
      },
      sessionDataType: {
        id: "string",
        email: "string",
        scope: "string",
        providerRole: "string",
      },
      token: {
        maxAgeInSeconds: 604800,
      },
    },
    baseURL:
      process.env.NODE_ENV !== "development"
        ? process.env.NODE_ENV === "production"
          ? "https://api.app.ooo/api/v1"
          : "https://app-staging.herokuapp.com/api/v1"
        : "http://localhost:8080/api/v1",
  },
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
