<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <!-- <myToolBar /> -->
  </v-app>
</template>

<script>
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "app",
  components: {
    myToolBar,
  }
  
};
</script>

<style scoped>
* {
  background: #f2f2f2;
  text-decoration: none;
}

router-link {
  text-decoration: none!important
}
</style>