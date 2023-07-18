<template>
  <div>
    <v-app>
      <v-main>
        <v-container class="pa-0 layout-container" fluid>
          <slot />
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script setup>
//composables
const $auth = useAuth();
const $router = useRouter();
//functions
onMounted(function () {
  const status = $auth.status.value;
  if (status === "authenticated") {
    $router.replace({ path: "/" });
  }
});
</script>
