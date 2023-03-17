<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
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