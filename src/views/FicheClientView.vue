<template>
  <FicheClient />
  <myToolbar />
</template>

<script>
// Components
import FicheClient from "@/components/FicheClient.vue";
import myToolbar from "@/components/MyToolbar";
export default ({
name: "HomeView",

components: {
  FicheClient,
   myToolbar,
},
});
</script>

<style scoped>
</style>