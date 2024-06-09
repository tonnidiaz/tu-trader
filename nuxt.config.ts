// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["@pinia/nuxt", "@nuxt/ui"],
    devtools: { enabled: false },
    imports:{
        autoImport: true
    }
});