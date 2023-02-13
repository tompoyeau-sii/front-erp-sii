<template>
  <v-app>
    <v-main>
        <router-view />
    </v-main>
  </v-app>
</template>

<script>
  import myToolbar from "@/components/MyToolbar";
  export default {
    name: "app",
    components: { myToolbar },
  };
</script>

<style scoped>
*{
  background: #F2F2F2;
  text-decoration: none;
}
</style>