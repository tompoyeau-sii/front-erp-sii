<template>
  <FicheClient />
  <myToolBar />
</template>

<script>
// Components
import FicheClient from "@/components/FicheClient.vue";
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "FicheClientView",

  components: {
    FicheClient,
    myToolBar,
  },
};
</script>

<style scoped>
</style>