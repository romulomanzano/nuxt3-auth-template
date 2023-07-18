<template>
  <div>
    <v-app>
      <v-navigation-drawer
        v-model="state.drawer"
        :mini-variant="state.miniVariant"
        :clipped="state.clipped"
        fixed
        app
        dark
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in pages"
            :key="i"
            :to="item.to"
            router
            exact
            :prepend-icon="item.icon"
            :title="item.title"
          >
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-app-bar
        :clipped-left="state.clipped"
        fixed
        dense
        app
        dark
        color="primary"
      >
        <v-app-bar-nav-icon @click.stop="state.drawer = !state.drawer" />
        <v-toolbar-title v-text="state.title" />
        <v-spacer />
        <v-menu left bottom>
          <template v-slot:activator="{ attrs }">
            <v-btn icon v-bind="attrs" @click="logout()">
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </template>
        </v-menu>
      </v-app-bar>
      <v-main>
        <v-container>
          <slot />
        </v-container>
      </v-main>

      <v-footer :absolute="!state.fixed" app dark color="primary">
        <footer></footer>
      </v-footer>
    </v-app>
  </div>
</template>
<script setup>
//composables
const $auth = useAuth();
const $router = useRouter();
//data
const state = reactive({
  clipped: true,
  drawer: false,
  fixed: false,
  miniVariant: false,
  right: true,
  rightDrawer: false,
  title: "Test App",
});
const pages = [
  {
    icon: "mdi-home",
    title: "Home",
    to: "/",
  },
];
//functions
const logout = async function () {
  $auth.signOut({ callbackUrl: "/login" });
};
</script>
