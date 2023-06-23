<template>
  <v-app>
    <myToolBar v-if="showToolbar" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "app",
  components: {
    myToolBar,
  },
  computed: {
    showToolbar() {
      // Vérifiez si la route actuelle n'est pas la page d'accueil
      return this.$route.name !== "ConnexionView";
    },
  },
};
</script>

<style scoped>
* {
  background: #f2f2f2;
  text-decoration: none;
}

router-link {
  text-decoration: none !important;
}
</style>