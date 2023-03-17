<template>
  <FicheCollab />
  <myToolBar />
</template>

<script>
// Components
import FicheCollab from "@/components/FicheCollab.vue";
import myToolBar from "@/components/MyToolbar.vue";
export default {
  name: "FicheClientView",

  components: {
    FicheCollab,
    myToolBar,
  },
};
</script>

<style scoped>
</style>