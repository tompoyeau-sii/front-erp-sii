<template>
  <Parametre />
  <Diplome />
  <Jobs />
  <myToolBar />
</template>

<script>
// Components
import Parametre from "@/components/parameters/Parametre.vue";
import myToolBar from "@/components/MyToolbar.vue";
import Diplome from "@/components/parameters/Diplome.vue";
import Jobs from "@/components/parameters/Jobs.vue";
export default {
  name: "ParametreView",

  components: {
    Parametre,
    myToolBar,
    Diplome,
    Jobs,
  },
};
</script>

<style scoped>
</style>