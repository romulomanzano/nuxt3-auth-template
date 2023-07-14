<template>
  <div>
    <v-app>
      <v-main>
        <v-container class="pa-0 layout-container" fluid>
          <Nuxt />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "App",
    };
  },
};
</script>
