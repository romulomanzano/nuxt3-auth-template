<template>
  <div>
    <v-app>
      <v-container class="pa-0 layout-container" fluid>
        <v-layout>
          <v-container>
            <Nuxt />
          </v-container>
        </v-layout>
      </v-container>
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
